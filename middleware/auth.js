const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.isAuthorizedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler(401, 'please login to access this resource'));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await userModel.findById({ _id: decodedData._id });

    next();
})


exports.isAuthorizeRoles = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(403, `Role: ${req.user.role} don't have permissions to acces this rresourse`));
        }

        next();
    }

}



