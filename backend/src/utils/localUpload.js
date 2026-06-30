import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "./errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const maxLogoBytes = 4 * 1024 * 1024;

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

export const saveLogoLocally = async ({ dataUri, filename, req }) => {
  const { buffer, mimeType } = parseImageDataUri(dataUri);

  const uploadsDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = mimeType.includes("svg") ? "svg" : mimeType.split("/")[1].replace("jpeg", "jpg");
  const uniqueName = `logo-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${extension}`;
  const filePath = path.join(uploadsDir, uniqueName);

  await fs.promises.writeFile(filePath, buffer);

  // Construct absolute URL
  let baseUrl = "";
  if (req) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
    const host = req.get("host");
    baseUrl = `${protocol}://${host}`;
  } else {
    baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
  }

  const secureUrl = `${baseUrl}/uploads/${uniqueName}`;

  return {
    secureUrl,
    filename: uniqueName,
  };
};
