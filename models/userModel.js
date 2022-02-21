const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'please enter your email id'],
        unique: true,
        validate: [validator.isEmail, 'please enter right email']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minlength: [8, 'password should be grater then 8 chatactor'],
        select: false
    },
    avatar: {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})


// jwt token 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};

// compare password 
userSchema.methods.comparePassword = async function (pass) {
    return await bcrypt.compare(pass, this.password);
}


// generate password reset token  
userSchema.methods.getResetPasswordToken = async function () {
    // generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hasing and adding reset password token to user schema 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}




// export userSchema 
module.exports = mongoose.model('users', userSchema);