const {
  checkSignupUserData,
  protect,
  allowFor,
  uploadUserAvatar,
} = require('./authMiddlewares');

module.exports = {
  protect,
  allowFor,
  checkSignupUserData,
  uploadUserAvatar,
};
