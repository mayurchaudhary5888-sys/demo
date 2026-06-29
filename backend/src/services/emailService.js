import nodemailer from "nodemailer";
import { env } from "../config/env.js";

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

/**
 * Sends a query ticket details email to the configured support email.
 * @param {Object} queryData 
 */
export const sendContactQueryEmail = async (queryData) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`[QUERY EMAIL DEV MODE] SMTP not configured. Query details for ${queryData.id}:`, queryData);
    return { delivered: false, fallback: true };
  }

  const mailOptions = {
    from: env.smtpFrom,
    to: "mayurchaudhary5888@gmail.com",
    subject: `New Contact Query Received - ${queryData.id} [${queryData.subject || "General"}]`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e4eaf7; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0B2A5B; border-bottom: 2px solid #F05A28; padding-bottom: 8px;">New Contact Query Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 35%;">Ticket ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${queryData.email}">${queryData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Query Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.queryType || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.subject || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Entity Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.entityName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Entity Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.entityType || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Location:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.city || "N/A"}, ${queryData.state || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Submitted Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${queryData.submittedDate}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #FF6B00; background: #fff8f5; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #07144A;">Message/Description:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${queryData.message}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Query notification email sent successfully: ${info.messageId}`);
    return { delivered: true, info };
  } catch (error) {
    console.error("Error sending query notification email:", error);
    throw error;
  }
};
