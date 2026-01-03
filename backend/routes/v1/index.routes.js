import express from "express";
import authRouter from "./auth.routes.js";
import imageRouter from "./image.routes.js";
import contentRouter from "./content.routes.js";

const router = express.Router();
router.use("/auth", authRouter);
router.use("/image", imageRouter);
router.use("/content", contentRouter);

export default router;
