import mongoose from 'mongoose';
import blogInterface from '../interfaces/blog.interface';

const blogSchema = new mongoose.Schema<blogInterface>({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}).set('validateBeforeSave', true);;

export default mongoose.model('Blogs', blogSchema);