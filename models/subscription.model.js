import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription Name is required"],
      trim: true,
      minLength: [2, "Subscription Name must be at least 2 characters long"],
      maxLength: [100, "Subscription Name must be at most 100 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: [0, "Subscription must be greater than 0"],
    },
    currency: {
      type: String,
      required: [true, "Subscription Currency is required"],
      enum: ["USD", "EUR", "GBP", "NGN"],
      default: "NGN",
    },
    frequency: {
      type: String,
      required: [true, "Subscription Frequency is required"],
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      required: true,
      // enum: [
      //   "entertainment",
      //   "productivity",
      //   "health",
      //   "finance",
      //   "news",
      //   "technology",
      //   "sports",
      // ],
      enum: {
        values: [
          "entertainment",
          "productivity",
          "health",
          "finance",
          "news",
          "technology",
          "sports",
        ],
        message: "{VALUE} is not a valid subscription category",
      },
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value < new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal Date must be after Start Date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Create an index on the user field for faster lookups
    },
  },
  { timestamps: true },
);

// // Auto-update the renewalDate based on the frequency when saving a subscription
subscriptionSchema.pre("save", async function () {
  if (!this.renewalDate) {
    const frequencyMap = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    const daysToAdd = frequencyMap[this.frequency];
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
  }

  // Auto-update the status if the renewal date has passed
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = "expired";
  }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
