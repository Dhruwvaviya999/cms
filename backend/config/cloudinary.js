import {cloudinary as v2 } from 'cloudinary';
import {dotenvConfig} from 'dotenv';
dotenvConfig();

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}


export {configureCloudinary, cloudinary}