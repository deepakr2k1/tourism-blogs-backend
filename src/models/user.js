const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        max: 50,
        required: true,
    },
    email: {
        type: String,
        max: 30,
        required: true,
    },
    password: {
        type: String,
        min: 6,
        max: 30,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}).set('validateBeforeSave', true);

module.exports = mongoose.model('User', user);