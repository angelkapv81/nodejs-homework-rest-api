const { Router } = require('express');

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  requestVerification,
} = require('../controllers/auth');

const { checkSignupUserData } = require('../middlewares/auth');

const router = Router();

// signup - register new user
router.post('/signup', checkSignupUserData, signup);

// login - login user - authentification
router.post('/login', login);

// logout - logout current user
router.post('/logout', logout);

// find user and send OTP by email to restore password
router.post('/forgot-password', forgotPassword);

// update password in DB
router.patch('/reset-password/:otp', resetPassword);

// Verify user email
router.get('/verify/:verificationToken', verifyEmail);

// Adding a second email to the user with a verification link
router.post('/verify', requestVerification);

module.exports = router;
