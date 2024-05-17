import mongoose from "mongoose";

export const OTP_Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    otp: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});