import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
configDotenv();
import Content from "../models/content.model.js";
import mongoose from "mongoose";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateContent = async (req, res) => {
  try {
    console.log(
      `Started processing of content generation request for user id ${req.user.id} and action is ${req.params.action}`
    );
    const { content } = req.body;
    const action = req.params.action;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const actionObj = ACTIONS[action];

    if (!actionObj) {
      return res.status(400).json({
        message: "Invalid action",
      });
    }

    const prompt = ` 
      ${actionObj.prompt}
      Content: ${content}
    `;

    const updated_content = await generateContentWithGemini(prompt);

    await Content.create({
      user_id: req.user.id,
      input_prompt: content,
      output_content: updated_content,
      type: action,
    });

    return res.status(200).json({
      message: actionObj.message,
      content: updated_content,
    });
  } catch (error) {
    console.error(`Error in generating content. Error is ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

async function generateContentWithGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

export const history = async (req, res) => {
  try {
    console.log(
      `Started processing content history request for user ${req.user.id}`
    );
    const id = req.user.id;
    const content = await Content.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          createdAt: 1,
          prompt: "$input_prompt",
          content: "$output_content",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    console.log(content);

    return res.status(200).json({
      message: "Content fetched successfully",
      content,
    });
  } catch (error) {
    console.error(
      `Error in fetching content history. Error is ${error.message}`
    );
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
