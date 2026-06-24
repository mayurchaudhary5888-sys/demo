import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { authRoutes } from "./routes/authRoutes.js";
import { contentRoutes } from "./routes/contentRoutes.js";
import { securityMiddleware } from "./middleware/security.js";
import { errorHandler, notFound } from "./utils/errors.js";

export const app = express();

app.set("trust proxy", 1);
app.use(securityMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "BHASKAR backend is healthy." });
});

app.use("/api/auth", authRoutes);
app.use("/api", contentRoutes);

app.use(notFound);
app.use(errorHandler);
