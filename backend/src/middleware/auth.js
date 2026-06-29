import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";
import { User } from "../models/User.js";

export const requireAuth = async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new AppError("Authentication required.", 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;

    // Verify account active status from database
    const userObj = await User.findById(decoded.sub);
    if (userObj && userObj.role !== "admin" && userObj.isActive === false) {
      return next(new AppError("Something wrong happens. Contact support please.", 403));
    }

    return next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError("Session expired. Please sign in again.", 401));
  }
};

export const optionalAuth = async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    const userObj = await User.findById(decoded.sub);
    if (userObj && userObj.role !== "admin" && userObj.isActive === false) {
      req.user = null;
    }
  } catch {
    req.user = null;
  }

  return next();
};

export const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admin access required.", 403));
  }
  return next();
};
