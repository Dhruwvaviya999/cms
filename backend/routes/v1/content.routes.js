import express from "express";
import { rewrite } from "../../controller/content.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const contentRouter = express.Router();

contentRouter.post("/rewrite", authMiddleware, rewrite);

export default contentRouter;