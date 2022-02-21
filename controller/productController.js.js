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

    req.body.user = req.user.id;

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


// create and update reviews
exports.createOrUpdatereview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await productModel.findById(productId);

    const isReviewed = product.reviews.find(item => {
        if (item.user.toString() == req.user._id.toString()) {
            return item;
        }
    });


    if (isReviewed) {
        product.reviews.forEach(item => {
            if (item.user.toString() == req.user._id.toString()) {
                item.rating = rating;
                item.comment = comment;
            }
        })
    }
    else {
        // console.log(product)
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avrage = 0;
    product.reviews.forEach(item => {
        avrage += item.rating;
    })

    product.ratings = avrage / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})

// get all reviews of single product 
exports.getAllReviews = catchAsyncError(async (req, res, next) => {

    const product = await productModel.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler(404, 'product not found'));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// get all reviews of single product 
exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await productModel.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler(404, 'product not found'));
    }

    const reviews = product.reviews.filter(item => item._id.toString() !== req.query.id.toString());


    let ratings, numOfReviews = 0;


    if (reviews.length > 0) {
        let avrage = 0;
        reviews.forEach(item => {
            avrage += item.rating;
        })

        ratings = avrage / reviews.length;

        numOfReviews = reviews.length;
    }




    await productModel.findByIdAndUpdate(req.query.productId,
        { reviews, ratings, numOfReviews },
        { new: true, runValidators: true, useFindAndModify: false });



    res.status(200).json({
        success: true
    })
})