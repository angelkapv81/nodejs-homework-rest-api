const { Router } = require('express');

const { signup, login, logout, forgotPassword, resetPassword } = require('../controllers/auth');
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

module.exports = router;
