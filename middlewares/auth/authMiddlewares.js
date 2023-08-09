const { v4: uuid } = require('uuid');

const multer = require('multer');

const {
  catchAsync,
  AppError,
  signupUserDataValidator,
} = require('../../utils');

const userService = require('../../services/auth/userService');
const jwtService = require('../../services/auth/jwtService');

exports.checkSignupUserData = catchAsync(async (req, res, next) => {
  const { error, value } = signupUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await userService.userExists({ email: value.email });

  req.body = value;

  next();
});

/**
 * Protect middleware. Allow only logged in users.
 */
exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];
  const userId = jwtService.checkToken(token);

  const currentUser = await userService.getUserById(userId);

  if (!currentUser) throw new AppError(401, 'Not logged in..');

  req.user = currentUser;

  next();
});

/**
 * Roles guard middleware
 * allowFor('admin', 'moderator')
 * use ONLY after 'protect'
 * @param  {String} roles
 * @returns {Function}
 */
exports.allowFor =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) return next();

    next(new AppError(403, 'You are not allowed to perform this action..'));
  };

// MULTER example
// config multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, 'public/img');
  },
  filename: (req, file, cbk) => {
    const extension = file.mimetype.split('/')[1]; // jpeg/jpg/png/gif

    // userID-random.fileExtension => ncdjasnhcjsadns-nuy48329qxbfy732nyfx73.jpg
    console.log('------------------->', req.user);
    cbk(null, `${req.user.id}-${uuid()}.${extension}`);
  },
});

// config multer filter
const multerFilter = (req, file, cbk) => {
  // 'image/*'
  if (file.mimetype.startsWith('image/')) {
    cbk(null, true);
  } else {
    cbk(new AppError(400, 'Please, upload images only!'), false);
  }
};

exports.uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
}).single('avatar');
