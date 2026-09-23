import express from "express";
import { contentWithId, generateContent, history, searchContent } from "../../controller/content.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const contentRouter = express.Router();

contentRouter.post("/:action", authMiddleware, generateContent);
contentRouter.get("/history", authMiddleware, history);
contentRouter.get("/search", authMiddleware, searchContent);
contentRouter.get("/:id", authMiddleware, contentWithId);

export default contentRouter;