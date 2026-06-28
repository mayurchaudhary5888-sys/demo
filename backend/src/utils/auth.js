import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const normalizeEmail = (email) => email.trim().toLowerCase();

export const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

export const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

export const generateOtp = () => {
  if (env.nodeEnv !== "production" && env.demoOtp) return env.demoOtp;
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const buildSession = (user) => ({
  email: user.email,
  role: user.role,
  name: user.name,
  startupId: user.startupId || null,
  selectedProgram: user.startupProfile?.selectedProgram || user.selectedProgram || null,
  isOnboarded: user.isOnboarded,
  dept: user.dept,
  isActive: user.isActive,
});
