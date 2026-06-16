const nodemailer = require("nodemailer");

const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
const isEmailConfigured = missingEnvVars.length === 0;

let transporter = null;

if (!isEmailConfigured) {
  console.warn(`SMTP is not configured. Missing: ${missingEnvVars.join(", ")}. OTP emails will be unavailable.`);
} else {
  const smtpPort = Number(process.env.SMTP_PORT);

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const verifySmtpConnection = async () => {
  if (!transporter) {
    console.warn("SMTP verify skipped because email service is not configured.");
    return false;
  }

  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully.");
    return true;
  } catch (error) {
    console.warn("SMTP verify failed. OTP emails may not work:", error.message);
    return false;
  }
};

module.exports = {
  transporter,
  isEmailConfigured,
  verifySmtpConnection
};
