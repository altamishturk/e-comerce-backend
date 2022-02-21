const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');


// new order 
exports.newOrder = catchAsyncError(async (req, res) => {

    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await orderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })


    res.status(201).json({
        success: true,
        order
    })
})

// get single order 
exports.getSingleOrder = catchAsyncError(async (req, res) => {

    const order = await orderModel.findById(req.params.id).populate("user", "name email");


    if (!order) {
        return next(new ErrorHandler(404, 'order not found'))
    }


    res.status(200).json({
        success: true,
        order
    })
})


// get loged in user orders
exports.myOrders = catchAsyncError(async (req, res) => {

    const orders = await orderModel.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
})


// get all orders (admin)
exports.getAllOrders = catchAsyncError(async (req, res) => {

    const orders = await orderModel.find();

    let totalAmount = 0;

    orders.forEach(item => {
        totalAmount += item.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


// get all orders (admin)
exports.updateOrder = catchAsyncError(async (req, res, next) => {

    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(404, 'order not found'))
    }

    if (order.orderStatus === 'Delevered') {
        return next(new ErrorHandler(400, "you order hass been delevered"))
    }


    order.orderItems.forEach(item => {
        updateStock(item.product, item.quantity);
    })


    order.orderStatus = req.body.status;

    if (req.body.status === 'Delevered') {
        order.deleveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})


async function updateStock(id, quantity) {

    const product = await productModel.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}


// delete order
exports.deleteOrder = catchAsyncError(async (req, res) => {

    const order = await orderModel.findById(req.params.id);


    if (!order) {
        return next(new ErrorHandler(404, 'order not found'))
    }

    await order.remove();

    res.status(200).json({
        success: true,
    })
})