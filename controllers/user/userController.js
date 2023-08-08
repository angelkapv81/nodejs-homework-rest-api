const { catchAsync } = require('../../utils');
const userService = require('../../services/userService');
const ImageService = require('../../services/imageService');

/**
 * Create new user controller.
 * @author Sergii Goncharuk
 * @category Controllers
 */
const createUser = catchAsync(async (req, res) => {
  // const newUser = new User(req.body);
  // await newUser.save();

  const newUser = await userService.createUser(req.body);

  res.status(201).json({
    msg: 'Success',
    user: newUser,
  });
});

/**
 * Find all users controller.
 * @author Sergii Goncharuk
 * @category Controllers
 */
const getAllUsers = catchAsync(async (req, res) => {
  // const users = await User.find().select('name email');
  // const users = await User.find().select('+password');
  // const users = await User.find().select('-__v');
  const users = await userService.getAllUsers();

  res.status(200).json({
    msg: 'Success',
    users,
  });
});

/**
 * Find user by id controller.
 * @author Sergii Goncharuk
 * @category Controllers
 */
const getOneUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    msg: 'Success',
    user,
  });
});

/**
 * Update user controller.
 * @author Sergii Goncharuk
 * @category Controllers
 */
const updateUser = catchAsync(async (req, res) => {
  // const { id } = req.params;

  // returns OLD doc version
  // const updatedUser = await User.findByIdAndUpdate(id, { name: req.body.name });

  // const updatedUser = await User.findByIdAndUpdate(id, { name: req.body.name }, { new: true });

  // req.body = {
  //  name: 'vndfsjvb',
  //  email: 'cndjsvchsjd@cdscsda.com'
  // }
  // const user = await User.findById(id);

  // Object.keys(req.body).forEach((key) => {
  //   user[key] = req.body[key];
  // });

  // const updatedUser = await user.save();

  const updatedUser = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    msg: 'Success',
    user: updatedUser,
  });
});

/**
 * Delete user controller.
 * @author Sergii Goncharuk
 * @category Controllers
 */
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  await userService.deleteUserById(id);

  res.sendStatus(204);
});

/**
 * Get logged in user data.
 * @author Sergii Goncharuk
 * @category Controllers
 */
const getMe = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

/**
 * Update logged in user data.
 * NOT for password!!
 */
const updateMe = catchAsync(async (req, res) => {
  const { user, file } = req;

  if (file) {
    user.avatar = await ImageService.save(
      file,
      { height: 600, width: 600, maxSize: 2 * 1024 * 1024 },
      'images',
      'users',
      user.id
    );
  }

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });

  const updatedUser = await user.save();

  res.status(200).json({
    user: updatedUser,
  });
});

/**
 * Update logged in user password.
 */
const updateMyPassword = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  updateMyPassword,
};
