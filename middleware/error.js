const errorHandler = require('../utils/errorHandler');

module.exports = (error, req, res, next) => {

    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'internal server error';

    // wrong mongodb id error 
    if (error.name === 'CastError') {
        const message = `resource not found. invalid ${error.path}`;
        error = new errorHandler(400, message);
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.stack
    })
}