import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bhaskar_startup_india",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  adminEmail: process.env.ADMIN_EMAIL || "admin@startupindia.gov.in",
  adminPassword: process.env.ADMIN_PASSWORD || "admin@123",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "BHASKAR Startup India <no-reply@startupindia.gov.in>",
  smtpSecure: process.env.SMTP_SECURE === "true",
};
