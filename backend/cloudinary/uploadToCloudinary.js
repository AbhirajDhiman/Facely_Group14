import cloudinary from "./cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath, folder = "Facely") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // Remove local file
    return result.secure_url; // Live URL
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

export const deleteFromCloudinary = async (url) => {
  const publicId = url.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(publicId);
};

export default uploadToCloudinary;
