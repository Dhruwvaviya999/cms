import express from "express";
import { generateContent, history } from "../../controller/content.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const contentRouter = express.Router();

contentRouter.post("/:action", authMiddleware, generateContent);

contentRouter.get("/history", authMiddleware, history);

export default contentRouter;