import { z } from "zod";

const email = z.string().trim().email().max(160).transform((value) => value.toLowerCase());
const allowedProgramIds = [
  "idea-validation-program",
  "msme-program",
  "foundation-program",
  "startup-program",
  "global-impact-program",
];

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  mobile: z.string().trim().regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/\d/, "Password must include a number."),
  startupId: z.string().trim().optional(),
  selectedProgram: z.enum(allowedProgramIds, {
    required_error: "Please select one program during registration.",
  }),
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

export const forgotPasswordSchema = z.object({
  email,
});

export const resetPasswordSchema = z.object({
  email,
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/\d/, "Password must include a number."),
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
