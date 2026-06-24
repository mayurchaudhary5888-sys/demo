import { Router } from "express";
import { login, register, resendOtp, verifyOtp } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/security.js";
import { loginSchema, registerSchema, resendOtpSchema, validateBody, verifyOtpSchema } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimiter, validateBody(registerSchema), register);
authRoutes.post("/login", authRateLimiter, validateBody(loginSchema), login);
authRoutes.post("/verify-otp", authRateLimiter, validateBody(verifyOtpSchema), verifyOtp);
authRoutes.post("/resend-otp", authRateLimiter, validateBody(resendOtpSchema), resendOtp);
