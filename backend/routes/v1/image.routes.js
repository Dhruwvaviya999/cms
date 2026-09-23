import express from "express";
import { generateImage, history } from "../../controller/image.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const imageRouter = express.Router();

imageRouter.post("/generate", authMiddleware, generateImage);
imageRouter.get("/history", authMiddleware, history);

export default imageRouter;
