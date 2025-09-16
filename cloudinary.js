const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.API_SECRET, // Replace with your Cloudinary API secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "airbnb-listings", // Folder name in your Cloudinary account
    allowed_formats: ["jpeg", "png", "jpg"], // Allowed file formats
  },
});

module.exports = {
  cloudinary,
  storage,
};
