import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      minLength: [2, "User Name must be at least 2 characters long"],
      maxLength: [50, "User Name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      trim: true,
      minLength: [6, "User Password must be at least 6 characters long"],
      maxLength: [100, "User Password must be at most 50 characters long"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

// {"name": "Moses Doe", "email": "kwristie@example.com", "password": "password1@23"}
