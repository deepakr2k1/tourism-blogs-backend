import mongoose from 'mongoose';
import otpInterface from '../interfaces/otp.interface';

const otp = new mongoose.Schema<otpInterface>({
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

export default mongoose.model('otps', otp);