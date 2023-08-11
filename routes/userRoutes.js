const { Router } = require('express');

const {
  getMe,
  createUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  updateMe,
  updateMyPassword,
} = require('../controllers/user');

const {
  checkUserId,
  checkCreateUserData,
  checkUpdateUserData,
  uploadUserAvatar,
  checkMyPassword,
} = require('../middlewares/user');

const { protect, allowFor } = require('../middlewares/auth');
const userRolesEnum = require('../constants/userRolesEnum');

const router = Router();

/**
 * CRUD = create read update delete
 *
 * REST API =================================
 * POST       /users            - create user
 * GET        /users            - get all users
 * GET        /users/<userID>   - get one user by id
 * PUT/PATCH  /users/<userID>   - update user by id
 * DELETE     /users/<userID>   - delete user by id
 */

// router.post('/', createUser);
// router.get('/', getAllUsers);
// router.get('/:id', checkUserId, getOneUser);
// router.patch('/:id', checkUserId, updateUser);
// router.delete('/:id', checkUserId, deleteUser);

router.use(protect);

router.get('/get-me', getMe);
router.patch('/avatar', uploadUserAvatar, updateMe);
router.patch('/update-my-password', checkMyPassword, updateMyPassword);

router.use(allowFor(userRolesEnum.ADMIN, userRolesEnum.MODERATOR));
router.route('/').post(checkCreateUserData, createUser).get(getAllUsers);

router.use('/:id', checkUserId);
router
  .route('/:id')
  .get(getOneUser)
  .patch(checkUpdateUserData, updateUser)
  .delete(deleteUser);

module.exports = router;
