const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const { isEmailConfigured } = require("../config/smtp");

const getHealthStatus = (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  const cloudinaryConfigured = Boolean(cloudinary.config().cloud_name);

  res.status(200).json({
    success: true,
    message: "Backend is running",
    environment: process.env.NODE_ENV || "development",
    emailService: isEmailConfigured ? "configured" : "not_configured",
    services: {
      backend: "ok",
      mongodb: mongoConnected ? "connected" : "disconnected",
      cloudinary: cloudinaryConfigured ? "configured" : "not_configured"
    }
  });
};

module.exports = {
  getHealthStatus
};
