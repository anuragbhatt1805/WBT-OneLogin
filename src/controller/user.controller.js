import path from "path";

import { Company, UserGroup, User, OTP } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendOTP } from "../utils/mail.util.js";


export const verifyUserViaOTP = asyncHandler(async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp || otp.length !== 6){
            throw new ApiError(400, "Please provide valid userId and OTP");
        }

        const user = await User.findById(userId);
        if (!user){
            throw new ApiError(400, "User not found");
        }

        const otpData = await OTP.findOne({user: userId, otp: otp});
        if (!otpData){
            throw new ApiError(400, "Invalid OTP");
        }

        user.verified = true;
        await user.save();

        await OTP.deleteMany({user: userId});

        return res.status(200).json(new ApiResponse(200, {
            userId: user._id,
            username: user.username
        }, "User verified successfully"));
        
    } catch (err) {
        throw new ApiError(500, err.message);
    }
})