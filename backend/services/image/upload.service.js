import { v2 as cloudinary } from "cloudinary";

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
        },
      )
      .end(buffer);
  });
}

export {
  uploadImage,
};