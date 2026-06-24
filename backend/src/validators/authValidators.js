import { z } from "zod";

const email = z.string().trim().email().max(160).transform((value) => value.toLowerCase());

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  mobile: z.string().trim().regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  password: z.string().min(6).max(128).optional().or(z.literal("")),
  startupId: z.string().trim().optional(),
  startupProfile: z.record(z.any()).optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const verifyOtpSchema = z.object({
  email,
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits."),
});

export const resendOtpSchema = z.object({
  email,
});

export const validateBody = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next({
      statusCode: 422,
      message: "Validation failed.",
      details: parsed.error.flatten().fieldErrors,
    });
  }
  req.body = parsed.data;
  return next();
};
