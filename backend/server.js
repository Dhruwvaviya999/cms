import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import router from "./routes/v1/index.routes.js";
import { configDotenv } from "dotenv";
import { connectRedis } from "./config/redis.js";
configDotenv();
const app = express();

const PORT = process.env.PORT || 8000;

try {
  validateEnvVariables();
} catch (error) {
  logger.error(error.message);
}

connectDB().catch((error) => {
  logger.error(`Failed to connect to the connectDB: ${error.message}`);
});

connectRedis().catch((error) => {
  logger.error(`Failed to connect to the redis: ${error.message}`);
});

configureCloudinary();

app.use(cors());
// parse json
app.use(express.json());

app.use(globalLimiter);

app.use("/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Generator CMS API",
    version: "1.0.0",
    status: "API is running",
  });
});


// 404 handler - should be after all routes
app.use((req, res) => {
  return sendError(res, HTTP_STATUS.NOT_FOUND, "Route not found");
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server started on PORT ${PORT}`);
});
