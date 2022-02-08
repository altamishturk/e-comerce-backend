const express = require('express');
const { getAllProducts, createNewProduct, updateProduct, deleteProduct, getOneProduct } = require('../controller/productController.js');
const router = express.Router();


// get all products route 
router.route('/products').get(getAllProducts);

// get one product 
router.route('/product/:id').get(getOneProduct);

// create new product 
router.route('/product/new').post(createNewProduct);

// update product 
router.route('/product/:id').put(updateProduct);

// delete product 
router.route('/product/:id').delete(deleteProduct);




module.exports = router;