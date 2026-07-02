import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";

let cachedTransporter;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bhaskarLogoPath = path.resolve(__dirname, "../../../frontend/public/logos/bhaskar.jpeg");
let logoExists = false;

try {
  if (fs.existsSync(bhaskarLogoPath)) {
    logoExists = true;
  }
} catch (err) {
  logoExists = false;
}

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
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  return cachedTransporter;
};

const getFromAddress = () => {
  return env.smtpFrom || env.smtpUser || "";
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/* ── Shared email wrapper ── */
const emailWrapper = (innerContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BHASKAR</title>
</head>
<body style="margin:0;padding:0;background:#1a1a1d;font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#ffffff;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1a1a1d;">
    <tr>
      <td align="center" style="padding:36px 16px 48px;">
        <table role="presentation" width="520" cellspacing="0" cellpadding="0" style="max-width:520px;width:100%;">

          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              ${logoExists
    ? `
                    <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:10px 16px;">
                      <img src="cid:bhaskarlogo" alt="BHASKAR - Bharat Startup Knowledge Access Registry" width="220" style="display:block;width:220px;max-width:100%;height:auto;" />
                    </div>`
    : `
                  <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:14px 24px;">
                    <span style="font-size:26px;font-weight:900;color:#0B2A5B;letter-spacing:0.06em;">BHASKAR</span>
                  </div>`
  }
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td>
              <div style="background:#242529;border-radius:18px;padding:36px 28px 40px;box-shadow:0 20px 50px rgba(0,0,0,0.35);">
                ${innerContent}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
                © ${new Date().getFullYear()} BHASKAR — Bharat Startup Knowledge Access Registry
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ─────────────────────────────────────────────
   OTP Email
   ───────────────────────────────────────────── */
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
    "",
    "Contact: support@startupbharat.info",
  ].join("\n");

  const otpDigitsHtml = otpDigits
    .map(
      (digit) =>
        `<td align="center" width="44" style="width:44px;height:52px;font-size:30px;font-weight:800;color:#5B9BFF;letter-spacing:0;font-family:'Courier New',Courier,monospace;">${escapeHtml(digit)}</td>`
    )
    .join(`<td width="8" style="width:8px;"></td>`);

  const innerHtml = `
    <!-- Greeting -->
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.35;font-weight:800;color:#ffffff;text-align:center;">
      Hi ${displayName},
    </h1>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#d1d5db;text-align:center;">
      Complete your registration using the below OTP
    </p>

    <!-- OTP Label -->
    <p style="margin:0 0 16px;font-size:16px;line-height:1.4;font-weight:700;color:#ffffff;text-align:center;">
      One Time Passcode :
    </p>

    <!-- OTP Digits -->
    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 18px;">
      <tr>
        ${otpDigitsHtml}
      </tr>
    </table>

    <!-- Expiry -->
    <p style="margin:0 0 32px;font-size:14px;line-height:1.6;color:#9ca3af;text-align:center;">
      OTP will expire in <strong style="color:#ffffff;">${otpExpirySeconds} seconds</strong>
    </p>

    <!-- Divider -->
    <div style="border-top:1px solid #3c3f46;margin:0 auto 28px;max-width:360px;"></div>

    <!-- Contact Note -->
    <p style="margin:0 auto 20px;max-width:340px;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.55;color:#e2e8f0;text-align:center;font-style:italic;">
      Please feel free to contact us in case of any queries
      or if you didn't request this, you can ignore this or
      let us know
    </p>

    <!-- Contact Link -->
    <p style="text-align:center;margin:0;">
      <a href="mailto:nodal-desk.bhaskar@nic.in" style="color:#FF6B6B;text-decoration:none;font-size:15px;font-weight:700;">
        nodal-desk.bhaskar@nic.in
      </a>
    </p>
  `;

  const html = emailWrapper(innerHtml);

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

  const attachments = [];
  if (logoExists) {
    attachments.push({
      filename: "bhaskar.jpeg",
      path: bhaskarLogoPath,
      cid: "bhaskarlogo",
    });
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
    attachments,
  });

  return { delivered: true };
};

/* ─────────────────────────────────────────────
   Password Reset OTP Email
   ───────────────────────────────────────────── */
export const sendPasswordResetOtpEmail = async ({ to, otp, name }) => {
  const subject = "Reset your BHASKAR password";
  const displayName = escapeHtml(name || "there");
  const otpDigits = String(otp).split("");
  const otpExpirySeconds = env.otpTtlMinutes * 60;

  const text = [
    `Hello ${name || "there"},`,
    "",
    `Your BHASKAR password reset verification code is ${otp}.`,
    `It expires in ${otpExpirySeconds} seconds.`,
    "",
    "If you did not request this code, you can safely ignore this message.",
    "",
    "Contact: nodal-desk.bhaskar@nic.in",
  ].join("\n");

  const otpDigitsHtml = otpDigits
    .map(
      (digit) =>
        `<td align="center" width="44" style="width:44px;height:52px;font-size:30px;font-weight:800;color:#5B9BFF;letter-spacing:0;font-family:'Courier New',Courier,monospace;">${escapeHtml(digit)}</td>`
    )
    .join(`<td width="8" style="width:8px;"></td>`);

  const innerHtml = `
    <!-- Greeting -->
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.35;font-weight:800;color:#ffffff;text-align:center;">
      Hi ${displayName},
    </h1>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#d1d5db;text-align:center;">
      Reset your account password using the below OTP
    </p>

    <!-- OTP Label -->
    <p style="margin:0 0 16px;font-size:16px;line-height:1.4;font-weight:700;color:#ffffff;text-align:center;">
      One Time Passcode :
    </p>

    <!-- OTP Digits -->
    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 18px;">
      <tr>
        ${otpDigitsHtml}
      </tr>
    </table>

    <!-- Expiry -->
    <p style="margin:0 0 32px;font-size:14px;line-height:1.6;color:#9ca3af;text-align:center;">
      OTP will expire in <strong style="color:#ffffff;">${otpExpirySeconds} seconds</strong>
    </p>

    <!-- Divider -->
    <div style="border-top:1px solid #3c3f46;margin:0 auto 28px;max-width:360px;"></div>

    <!-- Contact Note -->
    <p style="margin:0 auto 20px;max-width:340px;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.55;color:#e2e8f0;text-align:center;font-style:italic;">
      Please feel free to contact us in case of any queries
      or if you didn't request this, you can ignore this or
      let us know
    </p>

    <!-- Contact Link -->
    <p style="text-align:center;margin:0;">
      <a href="mailto:nodal-desk.bhaskar@nic.in" style="color:#FF6B6B;text-decoration:none;font-size:15px;font-weight:700;">
        nodal-desk.bhaskar@nic.in
      </a>
    </p>
  `;

  const html = emailWrapper(innerHtml);
  const transporter = getTransporter();

  if (!transporter) {
    if (env.nodeEnv === "production") {
      throw new AppError(
        "SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM before enabling production email delivery.",
        500
      );
    }

    console.warn(`[OTP DEV MODE] Password Reset Code for ${to}: ${otp}`);
    return { delivered: false, fallback: true };
  }

  const attachments = [];
  if (logoExists) {
    attachments.push({
      filename: "bhaskar.jpeg",
      path: bhaskarLogoPath,
      cid: "bhaskarlogo",
    });
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
    attachments,
  });

  return { delivered: true };
};

/* ─────────────────────────────────────────────
   Application Status / Document Request Email
   ───────────────────────────────────────────── */
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
    "",
    "Contact: nodal-desk.bhaskar@nic.in",
  ]
    .filter(Boolean)
    .join("\n");

  const docsListHtml = requestedDocs.length
    ? `
      <!-- Document Request Card -->
      <div style="margin:0 0 24px;padding:18px 20px;border-radius:14px;background:#2a2118;border:1px solid rgba(255,138,76,0.4);text-align:left;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.22em;color:#FF9A62;">
          ${escapeHtml(actionLabel || "Requested Documents")}
        </p>
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          ${requestedDocs
      .map(
        (item, index) => `
            <tr>
              <td width="28" valign="top" style="padding:5px 0;">
                <div style="width:22px;height:22px;border-radius:50%;background:#FF8A4C;color:#1a1a1d;font-size:11px;font-weight:800;text-align:center;line-height:22px;">
                  ${index + 1}
                </div>
              </td>
              <td style="padding:5px 0;font-size:14px;line-height:1.6;color:#f4f4f5;font-weight:600;">
                ${escapeHtml(item)}
              </td>
            </tr>`
      )
      .join("")}
        </table>
      </div>
    `
    : "";

  const innerHtml = `
    <!-- Category Label -->
    <p style="margin:0 0 14px;font-size:11px;line-height:1.4;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#FF6B6B;text-align:center;">
      ${escapeHtml(title || "Application Update")}
    </p>

    <!-- Headline -->
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.35;font-weight:800;color:#ffffff;text-align:center;">
      ${escapeHtml(headline || "We have an update on your application")}
    </h1>

    <!-- Body Text -->
    <p style="margin:0 auto 24px;max-width:420px;font-size:15px;line-height:1.65;color:#d1d5db;text-align:center;">
      ${statusBody}
    </p>

    <!-- Application Info Card -->
    <div style="margin:0 0 22px;padding:16px 20px;border-radius:14px;background:#2b2d32;border:1px solid #3c4047;text-align:left;">
      <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
        <tr>
          <td>
            <p style="margin:0 0 6px;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:0.2em;">Program</p>
            <p style="margin:0;font-size:15px;font-weight:800;color:#ffffff;">${programName}</p>
          </td>
        </tr>
        ${appId ? `
        <tr>
          <td style="padding-top:10px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:0.2em;">Application ID</p>
            <p style="margin:0;font-size:14px;color:#d8dee9;font-family:'Courier New',Courier,monospace;font-weight:600;">${appId}</p>
          </td>
        </tr>
        ` : ""}
      </table>
    </div>

    ${docsListHtml}

    <!-- Divider -->
    <div style="border-top:1px solid #3c3f46;margin:0 auto 28px;max-width:360px;"></div>

    <!-- Contact Note -->
    <p style="margin:0 auto 20px;max-width:360px;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.55;color:#e2e8f0;text-align:center;font-style:italic;">
      ${requestedDocs.length
      ? "Reply to this email with the above documents attached. Our review team will continue processing after we receive them."
      : "Please feel free to contact us in case of any queries or if you need further assistance."
    }
    </p>

    <!-- Contact Link -->
    <p style="text-align:center;margin:0;">
      <a href="mailto:nodal-desk.bhaskar@nic.in" style="color:#FF6B6B;text-decoration:none;font-size:15px;font-weight:700;">
        nodal-desk.bhaskar@nic.in
      </a>
    </p>
  `;

  const html = emailWrapper(innerHtml);

  if (!transporter) {
    if (env.nodeEnv === "production") {
      throw new AppError("SMTP is not configured for application emails.", 500);
    }
    console.warn(`[APPLICATION EMAIL DEV MODE] To ${to}: ${subject}`);
    return { delivered: false, fallback: true };
  }

  const attachments = [];
  if (logoExists) {
    attachments.push({
      filename: "bhaskar.jpeg",
      path: bhaskarLogoPath,
      cid: "bhaskarlogo",
    });
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
    replyTo: getFromAddress(),
    attachments,
  });

  return { delivered: true };
};
