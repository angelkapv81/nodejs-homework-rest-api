const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('./authController');

module.exports = { signup, login, logout, forgotPassword, resetPassword };
