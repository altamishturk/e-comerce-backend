const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { hash } = require('bcryptjs');

// register a new user 
exports.registerUser = catchAsyncError(async (req, res) => {

    const { name, email, password } = req.body;

    const user = await userModel.create({ name, email, password, avatar: { publicId: "test", url: 'test' } });


    sendToken(user, 201, res);

})


// login user  
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler(400, 'please enter email and password'));
    }

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler(401, 'invalid Email or Password'));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler(401, 'invalid Email or Password'));
    }

    sendToken(user, 200, res);

})


// logout user  
exports.logoutUser = catchAsyncError(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "loged Out Successfully"
    })
})

// forget password 
exports.forgetPassword = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler(404, 'user not found'));
    }

    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `here is your password reset link :- \n\n ${resetPasswordURL}`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'password reset',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email has been sent you ${req.body.email}`
        })
    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(500, error.message));
    }
})


// reset password 
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating hash token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await userModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

    if (!user) {
        return next(new ErrorHandler(400, 'Reset password token is invalid or has been expire'));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(400, `password dosen't match`));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // save user 
    user.save();

    // login user 
    sendToken(user, 200, res);
})


// get user details 
exports.getUserDetails = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})



// update password 
exports.updatePassword = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler(400, 'old password is incorrect'));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler(400, 'password does not match'));
    }

    if (req.body.newPassword === req.body.oldPassword) {
        return next(new ErrorHandler(400, 'old and new password can not be same'));
    }


    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        user
    })

    // login user 
    sendToken(user, 200, res);
})


// update profile 
exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // we will intigrate cloudnary later 

    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        user
    })

})


// get all users (admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await userModel.find();

    res.status(200).json({
        success: true,
        users
    })
})

// get user details (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(400, 'user does not exist with id:' + req.params.id))
    }

    res.status(200).json({
        success: true,
        user
    })
})



// update user role (admin) 
exports.updateUserRole = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    if (!user) {
        return next(new ErrorHandler(400, 'user not found'))
    }


    res.status(200).json({
        success: true,
        user
    })

})



// delete user (admin) 
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(400, 'user not found with the id:' + req.params.id))
    }

    await user.remove();

    res.status(200).json({
        success: true,
        user
    })

})

