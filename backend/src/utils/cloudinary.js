import crypto from "crypto";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";

const maxLogoBytes = 4 * 1024 * 1024;

const ensureCloudinaryConfig = () => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new AppError("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, then restart the backend.", 503);
  }
};

const parseImageDataUri = (dataUri = "") => {
  const match = String(dataUri).match(/^data:(image\/(?:png|jpe?g|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throw new AppError("Logo must be a valid base64 image.", 422);
  }

  const [, mimeType, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length || buffer.length > maxLogoBytes) {
    throw new AppError("Logo image must be smaller than 4MB.", 422);
  }

  return { buffer, mimeType };
};

const signUploadParams = (params) => {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${env.cloudinaryApiSecret}`).digest("hex");
};

export const uploadLogoToCloudinary = async ({ dataUri, filename }) => {
  ensureCloudinaryConfig();
  const { buffer, mimeType } = parseImageDataUri(dataUri);
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = env.cloudinaryUploadFolder;
  const signature = signUploadParams({ folder, timestamp });
  const extension = mimeType.includes("svg") ? "svg" : mimeType.split("/")[1].replace("jpeg", "jpg");
  const safeFilename = String(filename || `startup-logo.${extension}`).replace(/[^\w.-]+/g, "-");

  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: mimeType }), safeFilename);
  formData.append("api_key", env.cloudinaryApiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  let response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.error("Cloudinary upload request failed.", err);
    throw new AppError("Could not reach Cloudinary. Check internet access from the backend server.", 502);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Cloudinary upload rejected.", {
      status: response.status,
      message: data.error?.message,
    });
    throw new AppError(data.error?.message || "Cloudinary upload failed. Check your Cloudinary credentials.", 502);
  }

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    width: data.width,
    height: data.height,
    format: data.format,
  };
};
