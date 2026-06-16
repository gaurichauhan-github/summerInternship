const { transporter } = require("../config/smtp");

const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    const error = new Error("Email service is not configured");
    error.statusCode = 503;
    error.code = "EMAIL_SERVICE_NOT_CONFIGURED";
    throw error;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error.message);

    const emailError = new Error("Email could not be sent. Please contact admin.");
    emailError.statusCode = 503;
    emailError.code = "EMAIL_SEND_FAILED";
    throw emailError;
  }
};

module.exports = sendEmail;
