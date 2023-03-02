const mongoose = require('mongoose');

const otp = new mongoose.Schema({
    email: {
        type: String,
        max: 30,
        required: true,
    },
    code: {
        type: Number,
        min: 100000,
        max: 999999,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}).set('validateBeforeSave', true);

module.exports = mongoose.model('Otp', otp);