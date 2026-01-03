import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
configDotenv();
import Content from "../models/content.model.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const rewrite = async (req, res) => {
  try {
    console.log(
      `Started processing of rewriting request for user id ${req.user.id}`
    );
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const prompt = ` 
      Rewrite the following content to improve clarity, grammar, and tone.
      Keep the original meaning intact.
      Only return the rewritten content.
      Do NOT include explanations, bullet points, or multiple versions.

      Content: ${content}
    `;

    const updated_content = await generateContentWithGemini(prompt);

    await Content.create({
      user_id: req.user.id,
      input_prompt: content,
      output_content: updated_content,
      type: "rewrite",
    });

    return res.status(200).json({
      message: "Content rewritten successfully",
      content: updated_content,
    });
  } catch (error) {
    console.error(`Error in rewriting content. Error is ${error.message}`);
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
