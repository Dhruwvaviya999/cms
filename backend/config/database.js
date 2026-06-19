import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import logger from "../services/logger.service.js";
configDotenv();

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    logger.warn("Already connected to database, disconnecting first");
    await mongoose.disconnect();
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    const databaseName = mongoose.connection.db.databaseName;
    logger.info(`Database connected successfully to ${databaseName}`);
  } catch (error) {
    logger.error(`Error in connecting to the database: ${error.message}`);
    throw error;
  }
}

export default connectDB;
