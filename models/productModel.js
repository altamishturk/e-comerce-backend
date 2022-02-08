const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter product name']
    },
    description: {
        type: String,
        required: [true, 'Enter product description']
    },
    price: {
        type: Number,
        required: [true, 'Enter product price'],
        maxlength: [8, 'price must be less then 8 digit']
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [{
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, 'enter your catogery']
    },
    stock: {
        type: Number,
        required: [true, 'enter stack number'],
        maxlength: [4, `length can't be grater then 4 char`],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('products', productsSchema)