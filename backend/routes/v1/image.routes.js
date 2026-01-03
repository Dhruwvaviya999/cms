import express from "express";
import { generateImage } from "../../controller/image.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const imageRouter = express.Router();

imageRouter.post("/generate", authMiddleware, generateImage);

export default imageRouter;;
