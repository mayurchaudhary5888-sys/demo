import dotenv from "dotenv";

dotenv.config();

const requiredInProduction = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLIENT_ORIGIN",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
];

const defaultSecrets = new Set([
  "dev-only-change-this-secret",
  "replace-with-a-long-random-secret",
  "admin@123",
]);

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

if (isProduction) {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }

  if (defaultSecrets.has(process.env.JWT_SECRET) || String(process.env.JWT_SECRET).length < 32) {
    throw new Error("JWT_SECRET must be a strong random value with at least 32 characters in production.");
  }

  if (defaultSecrets.has(process.env.ADMIN_PASSWORD) || String(process.env.ADMIN_PASSWORD).length < 12) {
    throw new Error("ADMIN_PASSWORD must be changed and at least 12 characters in production.");
  }
}

const clientOriginValues = [
  process.env.CLIENT_ORIGINS,
  process.env.CLIENT_ORIGIN,
  "http://localhost:3000",
];

const clientOrigins = [...new Set(clientOriginValues.flatMap((value) => parseOrigins(value)))];
const allowAllClientOrigins = clientOrigins.includes("*");

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bhaskar_startup_india",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || (isProduction ? "2h" : "7d"),
  clientOrigin: clientOrigins[0],
  clientOrigins,
  allowAllClientOrigins,
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  adminEmail: process.env.ADMIN_EMAIL || "admin@startupindia.gov.in",
  adminPassword: process.env.ADMIN_PASSWORD || "admin@123",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "",
  smtpSecure: process.env.SMTP_SECURE === "true",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryUploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || "bhaskar-startup-india/logos",
};
