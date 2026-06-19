import { createClient } from "redis";
import logger from "../services/logger.service.js";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Redis connected");
  }
};

export { connectRedis, redisClient };
