const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controller/userController.js')
const { isAuthorizedUser, isAuthorizeRoles } = require('../middleware/auth')


router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forget').post(forgetPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthorizedUser, getUserDetails);

router.route('/password/update').put(isAuthorizedUser, updatePassword);

router.route('/me/update').put(isAuthorizedUser, updateProfile);

router.route('/admin/users').get(isAuthorizedUser, isAuthorizeRoles('admin'), getAllUsers);

router.route('/admin/user/:id').get(isAuthorizedUser, isAuthorizeRoles('admin'), getSingleUser);

router.route('/admin/user/:id').put(isAuthorizedUser, isAuthorizeRoles('admin'), updateUserRole);

router.route('/admin/user/:id').delete(isAuthorizedUser, isAuthorizeRoles('admin'), deleteUser);



module.exports = router;