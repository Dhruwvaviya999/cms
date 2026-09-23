import { redisClient } from "../config/redis.js";
import { HTTP_STATUS, RESOLUTION_MAP } from "../constant.js";
import logger from "../services/logger.service.js";
import { asyncHandler, sendSuccess } from "../services/response.service.js";


export const generateImage = asyncHandler(async (req, res) => {
  logger.info(
    `Started processing of image generation request for user id ${req.user.id}`,
  );
  const { prompt, resolution } = req.body;
  const cacheKey = `${resolution}:${prompt}`;

  if (!prompt) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, "Prompt is required");
  }

  logger.info(`Prompt: ${prompt} and Resolution: ${resolution}`);

  const cachedUrl = await redisClient.get(cacheKey);

  if (cachedUrl) {
    logger.info("Data is fetched from the cache");
    return sendSuccess(res, HTTP_STATUS.OK, "Image generated successfully", {
      image: cachedUrl,
    });
  }

  const dimension = RESOLUTION_MAP[resolution] || RESOLUTION_MAP["1024x1024"];

  const image = await generateImageBlob(prompt, dimension);

  const buffer = Buffer.from(await image.arrayBuffer());

  // fs.writeFileSync("output.png", buffer);

  const uploadedImage = await uploadImage(buffer);

  await redisClient.set(cacheKey, uploadedImage?.url);

  await Image.create({
    prompt,
    image_url: uploadedImage?.url,
    user_id: req.user.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, "Image generated successfully", {
    image: uploadedImage?.url,
  });
});

export const history = asyncHandler(async (req, res) => {
  logger.info(
    `Started processing image history request for user ${req.user.id}`,
  );
  const id = req.user.id;
  const images = await Image.aggregate([
    {
      $match: { user_id: new mongoose.Types.ObjectId(id) },
    },
    {
      $project: {
        _id: 1,
        url: "$image_url",
        createdAt: 1,
        prompt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return sendSuccess(res, HTTP_STATUS.OK, "Image fetched successfully", {
    images,
  });
});