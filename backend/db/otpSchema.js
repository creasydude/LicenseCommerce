import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: {
        type: String,
        maxLength: 255,
        required: true
    },
    otp: {
        type: String,
    },
    createdAt: { 
        type: Date, 
        expires: 60, 
        default: Date.now 
    }
});

const otp = mongoose.model("otp", otpSchema);
export default otp;