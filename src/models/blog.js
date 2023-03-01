const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogSchema = new schema({
    title: {
        type: String,
        max: 50,
        required: true,
    },
    snippet: {
        type: String,
        max: 200,
    },
    content: {
        type: String,
        max: 2000,
        required: true,
    },
    author: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}).set('validateBeforeSave', true);;

module.exports = mongoose.model('Blogs', blogSchema);