const express = require('express');
const app = express();

// json parser 
app.use(express.json());

// routes 
const productRoute = require('./routes/productRoute')
app.use('/api/v1', productRoute);


// middleware for error 
const errorMiddleWare = require('./middleware/error');
app.use(errorMiddleWare);



// exports 
module.exports = app;