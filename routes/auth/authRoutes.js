const { Router } = require('express');

const { signup, login, logout } = require('../../controllers/auth');
const { checkSignupUserData } = require('../../middlewares/auth');

const router = Router();

// signup - register new user
router.post('/signup', checkSignupUserData, signup);

// login - login user - authentification
router.post('/login', login);

// logout - logout current user
router.post('/logout', logout);

module.exports = router;
