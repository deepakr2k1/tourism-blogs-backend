import mongoose from 'mongoose';
import userInterface from '../interfaces/user.interface';

const userSchema = new mongoose.Schema<userInterface>({
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
    },
    status: {
        type: String,
        enum: ["UNVERIFIED", "VERIFIED"],
        default: "UNVERIFIED"
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}).set('validateBeforeSave', true);

export default mongoose.model('Users', userSchema);