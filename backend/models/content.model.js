import mongoose from "mongoose";
import { CONTENT_ACTIONS } from "../constant.js";

const contentSchema = new mongoose.Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    input_prompt: {
      required: [true, "Input prompt is required"],
      type: String,
      trim: true,
    },
    output_content: {
      required: [true, "Content is required"],
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: Object.values(CONTENT_ACTIONS),
        message: "Invalid content type",
      },
    },
  },
  {
    timestamps: true,
  },
);

contentSchema.index({ user_id: 1, createdAt: -1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
