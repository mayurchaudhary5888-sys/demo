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
    from: getFromAddress(),
    to: "support@startupbharat.info",
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

/**
 * Sends investor profile registration details to helloitsmeparth@gmail.com
 * @param {Object} investorData
 */
export const sendInvestorProfileEmail = async (investorData) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`[INVESTOR EMAIL DEV MODE] SMTP not configured. Investor details for ${investorData.id}:`, investorData);
    return { delivered: false, fallback: true };
  }

  const stagesHtml = Array.isArray(investorData.investmentStages) 
    ? investorData.investmentStages.join(", ") 
    : investorData.investmentStages || "N/A";
  
  const sectorsHtml = Array.isArray(investorData.sectors) 
    ? investorData.sectors.join(", ") 
    : investorData.sectors || "N/A";

  const mailOptions = {
    from: getFromAddress(),
    to: "support@startupbharat.info",
    subject: `New Investor Profile Registered - ${investorData.firmName} (${investorData.name})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e4eaf7; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0B2A5B; border-bottom: 2px solid #FF6B00; padding-bottom: 8px;">New Investor Profile Registration</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 35%;">Investor ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Representative Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Designation:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.designation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${investorData.email}">${investorData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Firm/Syndicate Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${investorData.firmName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Website URL:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.website ? `<a href="${investorData.website}" target="_blank">${investorData.website}</a>` : "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">LinkedIn Profile:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${investorData.linkedin}" target="_blank">${investorData.linkedin}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Investor Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.investorType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Target Stages:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${stagesHtml}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Sectors of Interest:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${sectorsHtml}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Average Ticket Size:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${investorData.ticketSize}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #FF6B00; background: #fff8f5; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #0B2A5B;">Investment Thesis:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${investorData.investmentThesis}</p>
        </div>

        ${investorData.portfolioCompanies ? `
        <div style="margin-top: 15px; padding: 15px; border-left: 4px solid #07144A; background: #f6f8fc; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #0B2A5B;">Key Portfolio Companies:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${investorData.portfolioCompanies}</p>
        </div>
        ` : ""}
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Investor profile email sent successfully: ${info.messageId}`);
    return { delivered: true, info };
  } catch (error) {
    console.error("Error sending investor profile email:", error);
    throw error;
  }
};
