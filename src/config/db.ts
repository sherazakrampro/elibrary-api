import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to database");
    });
    mongoose.connection.on("error", (error) => {
      console.log("error in connecting to database", error);
    });
    await mongoose.connect(config.dbUrl as string);
  } catch (error) {
    console.log("failed to connect to database", error);
    process.exit(1);
  }
};

export default connectDB;
