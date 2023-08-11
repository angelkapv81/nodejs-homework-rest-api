// ./contrllers/auth/authController.js

const { catchAsync } = require('../../utils');
const userService = require('../../services/auth');
const Email = require('../../services/emailService');

const signup = catchAsync(async (req, res) => {
  const { user, token } = await userService.signupUser(req.body);

  res.status(201).json({
    user,
    token,
  });
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await userService.loginUser(req.body);

  res.status(200).json({
    user,
    token,
  });
});

const logout = catchAsync(async (req, res, next) => {
  // Отримуємо токен з заголовка Authorization (Bearer токен)
  const token = req.headers.authorization?.split(' ')[1];

  await userService.getCurrentUser(token);

  // Повертаємо успішну відповідь
  res.sendStatus(204);
});

/**
 * Reset password request.
 * @author Angela Ponomarenko
 * @category Controllers
 */
const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction sent to email..',
    });
  }

  const otp = user.createPasswordResetToken();

  await user.save();

  // send otp by email
  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${otp}`;

    await new Email(user, resetUrl).sendRestorePassword();
  } catch (err) {
    console.log(err);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  res.status(200).json({
    msg: 'Password reset instruction sent to email..',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const updatedUser = await userService.resetPassword(req.params.otp, req.body.password);

  res.status(200).json({
    user: updatedUser,
  });
});

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword
};
