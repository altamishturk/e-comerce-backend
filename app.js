const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// json parser 
app.use(express.json());
app.use(cookieParser());

// routes 
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);


// middleware for error 
const errorMiddleWare = require('./middleware/error');
app.use(errorMiddleWare);



// exports 
module.exports = app;