import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";

let cachedTransporter;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bhaskarLogoPath = path.resolve(__dirname, "../../../frontend/public/logos/bhaskar.jpeg");

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

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const sendOtpEmail = async ({ to, otp, name }) => {
  const subject = "Your BHASKAR verification code";
  const displayName = escapeHtml(name || "there");
  const otpDigits = String(otp).split("");
  const otpExpirySeconds = env.otpTtlMinutes * 60;
  const text = [
    `Hello ${name || "there"},`,
    "",
    `Your BHASKAR verification code is ${otp}.`,
    `It expires in ${otpExpirySeconds} seconds.`,
    "",
    "If you did not request this code, you can safely ignore this message.",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#252728;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
      <div style="max-width:520px;margin:0 auto;padding:28px 18px 36px;">
        <div style="text-align:center;margin-bottom:22px;">
          <img src="cid:bhaskar-logo" alt="BHASKAR" style="display:inline-block;width:190px;max-width:72%;height:auto;border-radius:8px;background:#ffffff;padding:6px;" />
        </div>

        <div style="background:#1f2024;border-radius:14px;padding:26px 22px 30px;text-align:center;box-shadow:0 18px 42px rgba(0,0,0,0.26);">
          <h1 style="margin:0 0 22px;font-size:18px;line-height:1.35;font-weight:800;color:#ffffff;">
            Hi ${displayName},
          </h1>

          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#f4f4f5;">
            Complete your registration using the below OTP
          </p>

          <p style="margin:0 0 14px;font-size:18px;line-height:1.4;color:#ffffff;">
            One Time Passcode :
          </p>

          <div style="margin:0 auto 14px;text-align:center;font-size:0;">
            ${otpDigits
              .map(
                (digit) =>
                  `<span style="display:inline-block;margin:0 9px;font-size:28px;line-height:1;font-weight:800;letter-spacing:0;color:#76A7FF;">${escapeHtml(digit)}</span>`
              )
              .join("")}
          </div>

          <p style="margin:0 0 30px;font-size:14px;line-height:1.6;color:#e5e7eb;">
            OTP will expire in <strong style="color:#ffffff;">${otpExpirySeconds} seconds</strong>
          </p>

          <p style="margin:0 auto 24px;max-width:330px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.45;color:#f1f5f9;">
            Please feel free to contact us in case of any queries or if you didn't request this, you can ignore this or let us know
          </p>

          <a href="mailto:nodal-desk.bhaskar@nic.in" style="color:#ff756a;text-decoration:none;font-size:16px;font-weight:700;">
            nodal-desk.bhaskar@nic.in
          </a>
        </div>
      </div>
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
    attachments: [
      {
        filename: "bhaskar.jpeg",
        path: bhaskarLogoPath,
        cid: "bhaskar-logo",
      },
    ],
  });

  return { delivered: true };
};

const extractDocumentList = (value = "") =>
  String(value)
    .split(/[\n,•;-]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const sendApplicationStatusEmail = async ({
  to,
  subject,
  title,
  headline,
  body,
  application,
  actionLabel,
  actionText,
}) => {
  if (!to) return { delivered: false, skipped: true };

  const transporter = getTransporter();
  const programName = escapeHtml(application?.programName || "your application");
  const appId = escapeHtml(application?.id || "");
  const requestedDocs = extractDocumentList(actionText);
  const statusBody = escapeHtml(body || "");

  const text = [
    title || "Application update",
    "",
    `${headline || "Status update"} for ${application?.programName || "your application"}.`,
    appId ? `Application ID: ${application.id}` : "",
    "",
    body || "",
    requestedDocs.length ? `Requested documents: ${requestedDocs.join(", ")}` : "",
    "",
    "Please reply to this email with the listed documents attached.",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;padding:28px 18px 36px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:28px 24px;box-shadow:0 12px 30px rgba(15,23,42,0.08);">
          <p style="margin:0 0 10px;font-size:11px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:#f05a28;">
            ${escapeHtml(title || "Application Update")}
          </p>
          <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;font-weight:900;color:#0b2a5b;">
            ${escapeHtml(headline || "We have an update on your application")}
          </h1>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#334155;">
            ${statusBody}
          </p>
          <div style="margin:0 0 20px;padding:14px 16px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.18em;">Application</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">${programName}</p>
            ${appId ? `<p style="margin:6px 0 0;font-size:13px;color:#475569;font-family:monospace;">${appId}</p>` : ""}
          </div>
          ${
            requestedDocs.length
              ? `
                <div style="margin:0 0 20px;padding:16px;border-radius:14px;background:#fff7ed;border:1px solid #fdba74;">
                  <p style="margin:0 0 10px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.18em;color:#c2410c;">
                    ${escapeHtml(actionLabel || "Requested documents")}
                  </p>
                  <ul style="margin:0;padding-left:18px;color:#334155;font-size:14px;line-height:1.8;">
                    ${requestedDocs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                  </ul>
                </div>
              `
              : ""
          }
          <div style="padding:16px;border-radius:14px;background:#ecfdf5;border:1px solid #a7f3d0;">
            <p style="margin:0;font-size:14px;line-height:1.75;color:#065f46;">
              Reply to this email with the above documents attached. Our review team will continue processing after we receive them.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  if (!transporter) {
    if (env.nodeEnv === "production") {
      throw new AppError("SMTP is not configured for application emails.", 500);
    }
    console.warn(`[APPLICATION EMAIL DEV MODE] To ${to}: ${subject}`);
    return { delivered: false, fallback: true };
  }

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html,
    replyTo: env.smtpFrom,
    attachments: [
      {
        filename: "bhaskar.jpeg",
        path: bhaskarLogoPath,
        cid: "bhaskar-logo",
      },
    ],
  });

  return { delivered: true };
};
