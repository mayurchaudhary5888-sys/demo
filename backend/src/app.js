import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { authRoutes } from "./routes/authRoutes.js";
import { contentRoutes } from "./routes/contentRoutes.js";
import { apiRateLimiter, securityMiddleware } from "./middleware/security.js";
import { errorHandler, notFound } from "./utils/errors.js";
import { env } from "./config/env.js";

export const app = express();

app.set("trust proxy", 1);
app.use(securityMiddleware);
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true, limit: "6mb" }));
app.use(cookieParser());
app.use(apiRateLimiter);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "BHASKAR backend is healthy." });
});

app.use("/api/auth", authRoutes);
app.use("/api", contentRoutes);

app.use(notFound);
app.use(errorHandler);
