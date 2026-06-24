import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
];

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again shortly.",
  },
});
