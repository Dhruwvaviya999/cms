import { configDotenv } from "dotenv";
configDotenv();
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { InferenceClient } from "@huggingface/inference";
import { RESOLUTION_MAP } from "../constant.js";
import Image from "../models/image.model.js";

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateImage = async (req, res) => {
  try {
    console.log(`Started processing of image generation request`);
    const { prompt, resolution } = req.body;
    console.log(
      `Started processing of image generation request for user id ${req.user.id}`
    );

    if (!process.env.HUGGING_FACE_API_KEY) {
      console.log("Hugging Face API key not configured");
      return res.status(500).json({
        message: "Interval server error",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    console.log(`Prompt: ${prompt} and Resolution: ${resolution}`);

    const dimension = RESOLUTION_MAP[resolution] || RESOLUTION_MAP["1024x1024"];

    const image = await generateImageBlob(prompt, dimension);

    const buffer = Buffer.from(await image.arrayBuffer());

    fs.writeFileSync("output.png", buffer);

    const uploadedImage = await uploadImage(buffer);

    await Image.create({
      prompt,
      image_url: uploadedImage?.url,
      user_id: req.user.id,
    });

    return res.json({
      message: "Image generated successfully",
      image: uploadedImage?.url,
    });
  } catch (error) {
    console.error(`Error in generating image. Error is ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

async function generateImageBlob(prompt, dimension) {
  return await client.textToImage({
    provider: "auto",
    model: "black-forest-labs/FLUX.1-schnell",
    inputs: prompt,
    parameters: {
      num_inference_steps: 5,
      width: dimension.width,
      height: dimension.height,
    },
  });
}

async function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", folder: "generated-ai-image" },
        (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        }
      )
      .end(buffer);
  });
}

export const history = async (req, res) => {
};