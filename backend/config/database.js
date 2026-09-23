import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import logger from "../services/logger.service.js";
configDotenv();

// Shared across requests so a serverless instance connects once and reuses it
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
      .then(({ connection }) => {
        logger.info(
          `Database connected successfully to ${connection.db.databaseName}`,
        );
        return connection;
      })
      .catch((error) => {
        // Reset so the next request retries instead of failing forever
        connectionPromise = null;
        logger.error(`Error in connecting to the database: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
}

export default connectDB;
