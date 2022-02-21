const express = require('express');
const { getAllProducts, createNewProduct, updateProduct, deleteProduct, getOneProduct, createOrUpdatereview, getAllReviews, deleteReview } = require('../controller/productController.js');
const router = express.Router();
const { isAuthorizedUser, isAuthorizeRoles } = require('../middleware/auth')


// get all products route 
router.route('/products').get(getAllProducts);

// get one product 
router.route('/product/:id').get(getOneProduct);

// create new product 
router.route('/product/new').post(isAuthorizedUser, isAuthorizeRoles('admin'), createNewProduct);

// update product 
router.route('/product/:id').put(isAuthorizedUser, isAuthorizeRoles('admin'), updateProduct);

// delete product 
router.route('/product/:id').delete(isAuthorizedUser, isAuthorizeRoles('admin'), deleteProduct);

// create and update review 
router.route('/review').put(isAuthorizedUser, createOrUpdatereview);

// get all reviews 
router.route('/reviews').get(getAllReviews);

// delete review 
router.route('/review').delete(isAuthorizedUser, deleteReview);




module.exports = router;