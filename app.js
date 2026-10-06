import express from "express";
import { PORT } from "./config/env.js";

import cookieParser from "cookie-parser";

// Routes Imports
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import workflowRouter from "./routes/workflow.routes.js";


// Middleware Imports
import errorMiddleware from "./middleware/error.middleware.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";

// DB Import
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.use(express.json()); // This allows the app to process JSON-data sent in the request body. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({ extended: false })); // This helps us to process formData sent via HTML forms in a simple format.
app.use(cookieParser()); // Read cookies from incoming request so your app can store user data
app.use(arcjetMiddleware)

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("<h1>HELLO WORLD</h1>");
});

app.listen(PORT, async () => {
  console.log(
    `Subscription Tracker API is running on http://localhost:${PORT}`,
  );
  await connectToDatabase();
});
