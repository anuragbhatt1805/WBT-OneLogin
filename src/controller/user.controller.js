import path from "path";

import { Company, UserGroup, User, OTP } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendOTP } from "../utils/mail.util.js";

export const generateToken = async (_id) => {
    const user = await User.findById(_id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
}

export const verifyUserViaOTP = asyncHandler(async (req, res) => {
    try {

        if (!req.user) {
            throw new ApiError(400, "User not logged in");
        }

        const { otp } = req.body;
        if (!otp || otp.length !== 6){
            throw new ApiError(400, "Please provide valid userId and OTP");
        }

        const user = await User.findById(req.user._id);

        if (!user){
            throw new ApiError(400, "User not found");
        }

        const otpData = await OTP.findOne({user: req.user._id, otp: otp});

        if (!otpData){
            throw new ApiError(400, "Invalid OTP");
        }

        user.verified = true;
        await user.save();

        await OTP.deleteMany({user: req.user._id});

        return res.status(200).json(new ApiResponse(200, {
            username: user.username
        }, "User verified successfully"));
        
    } catch (err) {
        throw new ApiError(500, err.message);
    }
})