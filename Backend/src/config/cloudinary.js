const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.Cloudinary_name;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.cloudinary_api_key;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.api_key;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("Cloudinary environment variables are missing or incomplete.");
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  console.log("Cloudinary configured successfully");
}

module.exports = cloudinary;
