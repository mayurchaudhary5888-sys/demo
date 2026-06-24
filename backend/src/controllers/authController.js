import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { OtpToken } from "../models/OtpToken.js";
import { AppError } from "../utils/errors.js";
import { buildSession, generateOtp, hashOtp, normalizeEmail, signToken } from "../utils/auth.js";
import { sendOtpEmail } from "../utils/otpEmail.js";

const ensureAdminUser = async () => {
  const email = normalizeEmail(env.adminEmail);
  const existing = await User.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await User.create({
    name: "Dr. A. K. Sharma",
    email,
    passwordHash,
    role: "admin",
    dept: "DPIIT Seed Fund Committee",
    isEmailVerified: true,
    isOnboarded: true,
  });
};

const issueRegistrationOtp = async (email) => {
  const otp = generateOtp();
  await OtpToken.deleteMany({ email, purpose: "registration" });
  await OtpToken.create({
    email,
    otpHash: hashOtp(otp),
    purpose: "registration",
    expiresAt: new Date(Date.now() + env.otpTtlMinutes * 60 * 1000),
  });

  return otp;
};

export const register = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const startupId = req.body.startupId || `startup-${Date.now()}`;
    const startupProfile = req.body.startupProfile
      ? {
          ...req.body.startupProfile,
          id: startupId,
          email,
          mobile: req.body.mobile,
        }
      : undefined;

    const update = {
      name: req.body.name,
      email,
      mobile: req.body.mobile,
      startupId,
      startupProfile,
      role: "founder",
      isOnboarded: true,
      isEmailVerified: false,
    };

    if (req.body.password) {
      update.passwordHash = await bcrypt.hash(req.body.password, 12);
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const otp = await issueRegistrationOtp(email);
    await sendOtpEmail({ to: email, otp, name: user.name });

    res.status(201).json({
      success: true,
      message: "Verification code sent to your email address.",
      email: user.email,
      startupId: user.startupId,
    });
  } catch (err) {
    await OtpToken.deleteMany({ email: normalizeEmail(req.body?.email || ""), purpose: "registration" }).catch(() => {});
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    await ensureAdminUser();

    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !user.passwordHash) {
      throw new AppError("Invalid account credentials entered.", 401);
    }

    const passwordOk = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordOk) {
      throw new AppError("Invalid account credentials entered.", 401);
    }

    if (user.role !== "admin" && !user.isEmailVerified) {
      throw new AppError("Please verify your email before logging in.", 403);
    }

    const token = signToken(user);
    res.json({
      success: true,
      message: "Secure session active.",
      token,
      user: buildSession(user),
    });
  } catch (err) {
    await OtpToken.deleteMany({ email: normalizeEmail(req.body?.email || ""), purpose: "registration" }).catch(() => {});
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const record = await OtpToken.findOne({ email, purpose: "registration" }).sort({ createdAt: -1 });

    if (!record) {
      throw new AppError("Verification OTP expired or not found.", 400);
    }

    if (record.attempts >= 5) {
      await OtpToken.deleteMany({ email, purpose: "registration" });
      throw new AppError("Too many invalid OTP attempts. Please register again.", 429);
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await OtpToken.deleteMany({ email, purpose: "registration" });
      throw new AppError("Verification OTP expired. Please register again.", 400);
    }

    if (record.otpHash !== hashOtp(req.body.otp)) {
      record.attempts += 1;
      await record.save();
      throw new AppError("Incorrect 6-digit verification code.", 400);
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isEmailVerified: true } },
      { new: true }
    );

    if (!user) {
      throw new AppError("Registration record not found.", 404);
    }

    await OtpToken.deleteMany({ email, purpose: "registration" });

    const token = signToken(user);
    res.json({
      success: true,
      message: "Verification code approved! Welcome to Bhaskar.",
      token,
      user: buildSession(user),
      startupProfile: user.startupProfile,
    });
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    await ensureAdminUser();

    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Registration record not found.", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified.", 400);
    }

    const otp = await issueRegistrationOtp(email);
    await sendOtpEmail({ to: email, otp, name: user.name });

    res.json({
      success: true,
      message: "A new verification code has been sent to your email address.",
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};
