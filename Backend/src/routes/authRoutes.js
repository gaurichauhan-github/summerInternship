const express = require('express');
const {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp,
  getProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOtp);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
