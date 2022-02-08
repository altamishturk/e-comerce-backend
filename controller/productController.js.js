const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apifeatures');



// get all products 
exports.getAllProducts = catchAsyncError(async (req, res) => {

    const resultPerPage = 5;
    const productCount = await productModel.countDocuments();

    // filter product using query 
    const apiFeatures = new ApiFeatures(productModel.find(), req.query).search().filter().pagination(resultPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        products,
        productCount
    });
});

// get one product 
exports.getOneProduct = catchAsyncError(async (req, res, next) => {

    let product = await productModel.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler(404, 'product not found'))
    }

    res.status(200).json({
        success: true,
        product
    });

});

// create new product -- admin route 
exports.createNewProduct = catchAsyncError(async (req, res) => {
    const createdProduct = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        createdProduct
    })
});


// update  products -- admin 
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    // console.log(req.params.id)
    let product = await productModel.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler(404, 'product not found'))
    }

    product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })

    res.status(200).json({
        success: true,
        product
    });

});

// delete products -- admin 
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    let product = await productModel.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler(404, 'product not found'))
    }

    product.remove();

    res.status(200).json({
        success: true,
        product
    });

});



