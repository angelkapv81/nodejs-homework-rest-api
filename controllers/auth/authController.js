// ./contrllers/auth/authController.js

const { catchAsync, generateVerificationToken } = require('../../utils');
const userService = require('../../services/auth');
const Email = require('../../services/emailService');

const signup = catchAsync(async (req, res) => {
  const { user, token } = await userService.signupUser(req.body);

  // send verification token by email

  const { verificationToken } = user;

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;

    await new Email(user, resetUrl).sendVefificationToken();
  } catch (err) {
    console.log(err);
  }

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

const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;

  const user = await userService.verifyUserEmail(verificationToken);

  if (!user) {
    return res.status(404).json({
      msg: 'User not found..'
    });
  }

  user.verify = true;
  user.verificationToken = null;

  user.save();

  res.status(200).json(
    {
      msg: 'Verification successful..'
    }
  );
});

const requestVerification = catchAsync(async (req, res) => {
  if (!req.body.email) {
    return res.json({
      msg: 'missing required field email'
    });
  }
  const user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    return res.status(404).json({
      msg: 'User not found..'
    });
  }

  if (user.verify) {
    return res.status(400).json({
      msg: 'Verification has already been passed..'
    });
  }

  const { verificationToken, hashedToken } = generateVerificationToken();

  user.verificationToken = hashedToken;
  user.save();

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
    await new Email(user, resetUrl).sendVefificationToken();
  } catch (err) {
    console.log(err);
  }

  res.status(200).json(
    {
      msg: 'Verification email sent..'
    }
  );
});

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  requestVerification
};
