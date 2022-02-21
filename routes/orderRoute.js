const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controller/orderController');
const router = express.Router();
const { isAuthorizedUser, isAuthorizeRoles } = require('../middleware/auth')


// get all products route 
router.route('/order/new').post(isAuthorizedUser, newOrder);

router.route('/order/:id').get(isAuthorizedUser, isAuthorizeRoles('admin'), getSingleOrder);

router.route('/orders/me/').get(isAuthorizedUser, myOrders);

router.route('/admin/orders').get(isAuthorizedUser, isAuthorizeRoles('admin'), getAllOrders);

router.route('/admin/order/:id').put(isAuthorizedUser, isAuthorizeRoles('admin'), updateOrder);

router.route('/admin/order/:id').delete(isAuthorizedUser, isAuthorizeRoles('admin'), deleteOrder);






module.exports = router;