import mongoose from "mongoose";
import "dotenv/config";
import env from "../utils/validateEnv";

const dbConnection = async () => {
  try {
    await mongoose.connect(env.MONGODB_URL, {});
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};

export default dbConnection;
