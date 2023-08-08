const { AppError, catchAsync, userValidators } = require('../../utils');
const userService = require('../../services/auth');
const ImageService = require('../../services/imageService');

/**
 * Validate id and check user exists by id.
 * @author Sergii Goncharuk
 * @category Middlewares
 */
const checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await userService.userExistsById(id);

  next();
});

/**
 * Check create user data.
 * @author Sergii Goncharuk
 * @category Middlewares
 */
const checkCreateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.createUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await userService.userExists({ email: value.email });

  req.body = value;

  next();
});

/**
 * Check update user data.
 * @author Sergii Goncharuk
 * @category Middlewares
 */
const checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.updateUserDataValidator(req.body);

  // 1. check if this email already exists
  // 2. check if existed user id !== current user id
  // const userExists = await User.exists({ email: value.email, _id: { $ne: req.params.id } });

  // if (userExists) return next(new AppError(409, 'User with this email exists..'));
  // if (userExists) throw new AppError(409, 'User with this email exists..');
  await userService.userExists({
    email: value.email,
    _id: { $ne: req.params.id },
  });

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  req.body = value;

  next();
});

/**
 * Handle multipart form data middleware.
 */
const uploadUserAvatar = ImageService.initUploadMiddleware('avatar');

/**
 * Check current password and set new one.
 */
const checkMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // :TODO validate new password with regex

  await userService.checkUserPassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  next();
});

module.exports = {
  checkUserId,
  checkCreateUserData,
  checkUpdateUserData,
  uploadUserAvatar,
  checkMyPassword,
};
