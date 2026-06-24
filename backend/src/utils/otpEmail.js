import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";

let cachedTransporter;

const hasSmtpConfig = () => Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const getTransporter = () => {
  if (!hasSmtpConfig()) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return cachedTransporter;
};

export const sendOtpEmail = async ({ to, otp, name }) => {
  const subject = "Your BHASKAR verification code";
  const text = [
    `Hello ${name || "there"},`,
    "",
    `Your BHASKAR verification code is ${otp}.`,
    `It expires in ${env.otpTtlMinutes} minutes.`,
    "",
    "If you did not request this code, you can safely ignore this message.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">BHASKAR verification code</h2>
      <p>Hello ${name || "there"},</p>
      <p>Your one-time verification code is:</p>
      <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0; color: #0b2a5b;">${otp}</div>
      <p>This code expires in ${env.otpTtlMinutes} minutes.</p>
      <p>If you did not request this code, you can ignore this email.</p>
    </div>
  `;

  const transporter = getTransporter();

  if (!transporter) {
    if (env.nodeEnv === "production") {
      throw new AppError(
        "SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM before enabling production email delivery.",
        500
      );
    }

    console.warn(`[OTP DEV MODE] Code for ${to}: ${otp}`);
    return { delivered: false, fallback: true };
  }

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true };
};
