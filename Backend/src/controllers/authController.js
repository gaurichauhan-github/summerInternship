const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateOtp = require('../utils/generateOtp');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { isEmailConfigured } = require('../config/smtp');

const getOtpExpiry = () => {
  const minutes = Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10;
  return new Date(Date.now() + minutes * 60 * 1000);
};

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
});

const isEmailServiceError = (error) => (
  error.code === 'EMAIL_SERVICE_NOT_CONFIGURED' || error.code === 'EMAIL_SEND_FAILED'
);

const emailServiceUnavailableResponse = (res) => res.status(503).json({
  success: false,
  message: 'Email service is not configured. OTP cannot be sent.',
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    if (!isEmailConfigured) {
      return emailServiceUnavailableResponse(res);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = getOtpExpiry();

    await sendEmail({
      to: normalizedEmail,
      subject: 'Verify your email address',
      text: `Your OTP code is ${otp}. It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>.</p><p>It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.</p>`,
    });

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt,
      isEmailVerified: false,
    });

    return res.status(201).json({ success: true, message: 'OTP sent to email. Please verify to complete registration.' });
  } catch (error) {
    if (isEmailServiceError(error)) {
      return emailServiceUnavailableResponse(res);
    }

    next(error);
  }
};

const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified. Please log in.' });
    }

    if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP is invalid or has expired' });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'OTP is invalid' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (!isEmailConfigured) {
      return emailServiceUnavailableResponse(res);
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = getOtpExpiry();

    await sendEmail({
      to: user.email,
      subject: 'Your login OTP code',
      text: `Your login OTP code is ${otp}. It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
      html: `<p>Your login OTP code is <strong>${otp}</strong>.</p><p>It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.</p>`,
    });

    user.otp = hashedOtp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    return res.status(200).json({ success: true, message: 'Login OTP sent to email' });
  } catch (error) {
    if (isEmailServiceError(error)) {
      return emailServiceUnavailableResponse(res);
    }

    next(error);
  }
};

const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP is invalid or has expired' });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'OTP is invalid' });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: 'Login verified successfully',
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, user: getSafeUser(req.user) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp,
  getProfile,
};
