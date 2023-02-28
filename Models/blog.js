const mongoose = require('mongoose');
const schema = mongoose.Schema;
// Schema define structure

const blogSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    snippet: {
        type: String,
    },
    content: {
        type: String,
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

const BlogModel = mongoose.model('Blogs', blogSchema);
module.exports = BlogModel;