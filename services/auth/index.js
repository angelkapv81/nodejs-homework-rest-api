const { signToken, checkToken } = require('./jwtService');
const {
  userExistsById,
  updateUser,
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signupUser,
  loginUser,
  getCurrentUser,
  logout,
  getUserByEmail,
  resetPassword,
  verifyUserEmail,
  requestVerification
} = require('./userService');

module.exports = {
  signToken,
  checkToken,
  userExistsById,
  updateUser,
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signupUser,
  loginUser,
  getCurrentUser,
  logout,
  getUserByEmail,
  resetPassword,
  verifyUserEmail,
  requestVerification
};
