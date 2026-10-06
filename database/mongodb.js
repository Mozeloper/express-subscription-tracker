import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";
import process from "node:process";

if (!DB_URI) {
  throw new Error(
    "PLEASE DEFINE THE MONGODB_URI ENVIRONMENT VARAIBLE INSIDE .env<development/production>.local",
  );
}

// Connect to DB

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectToDatabase;
