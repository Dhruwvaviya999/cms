import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Fixed: Standard default import
import router from "./routes/v1/index.routes.js";
import { connectRedis } from "./config/redis.js";
import connectDB from "./config/database.js";
import logger from "./services/logger.service.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { validateEnvVariables } from "./config/env.js";
import { sendError } from "./services/response.service.js";
import { HTTP_STATUS } from "./constant.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { globalLimiter } from "./middleware/ratelimitter.middleware.js";

// Initialize environment variables first thing
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Validate environment variables safely
try {
  validateEnvVariables();
} catch (error) {
  logger.error(`Env Validation Error: ${error.message}`);
}

// Establish asynchronous database connections
connectDB().catch((error) => {
  logger.error(`Failed to connect to connectDB: ${error.message}`);
});

if (process.env.REDIS_HOST) {
  connectRedis().catch((error) => {
    logger.error(`Failed to connect to redis: ${error.message}`);
  });
} else {
  logger.warn("REDIS_HOST not set, image caching disabled");
}

// Configure third-party integrations
configureCloudinary();

// Behind Vercel's proxy: use X-Forwarded-For so rate limiting is per client, not per proxy
app.set("trust proxy", 1);

// Middleware stack
app.use(cors());
app.use(express.json());
app.use(globalLimiter); // Protect your CMS API endpoints

// Core Routes (/api prefix: Vercel routes /api/* to this service with the full path)
app.use(["/v1", "/api/v1"], router);

app.get(["/", "/api"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Generator CMS API",
    version: "1.0.0",
    status: "API is running",
  });
});

// 404 handler - placed after all valid routes
app.use((req, res) => {
  return sendError(res, HTTP_STATUS.NOT_FOUND, "Route not found");
});

// Global Error handling middleware - must be last
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server started on PORT ${PORT}`);
});
