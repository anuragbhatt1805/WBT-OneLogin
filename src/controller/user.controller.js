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
        await user.save({validateBeforeSave: false});

        await OTP.deleteMany({user: req.user._id});

        return res.status(200).json(new ApiResponse(200, {
            username: user.username
        }, "User verified successfully"));
        
    } catch (err) {
        throw new ApiError(500, err.message);
    }
})

export const getNewOTP = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(400, "User not logged in");
        }

        const user = await User.findById(req.user._id);

        if (!user){
            throw new ApiError(400, "User not found");
        }

        if (user.verified){
            throw new ApiError(400, "User already verified");
        }

        const otp = await OTP.findOne({user: req.user._id});

        if (!otp) {
            const newOtp = await OTP.create({
                user: req.user._id,
                otp: Math.floor(100000 + Math.random() * 900000)
            });
            
            if (!newOtp){
                throw new ApiError(500, "Failed to send OTP");
            }

            // TODO: Uncomment this line after integrating mail service
            // await sendOTP(user.email, newOtp.otp);

            return res.status(200).json(new ApiResponse(200, {
                username: user.username
            }, "OTP sent successfully"));
        } else {
            otp.otp = Math.floor(100000 + Math.random() * 900000);
            await otp.save();

            // TODO: Uncomment this line after integrating mail service
            // await sendOTP(user.email, otp.otp);

            return res.status(200).json(new ApiResponse(200, {
                username: user.username
            }, "OTP sent successfully"));
        }
    } catch (err) {
        throw new ApiError(500, err.message);
    }
})

export const login = asyncHandler(async (req, res) => {
    try {
        if (!req.body.username ||!req.body.password){
            throw new ApiError(400, "Please provide username and password");
        }

        const { username, password } = req.body;

        const user = await User.findOne({username: username});

        if (!user){
            throw new ApiError(400, "User not found");
        }

        if (!user.verifyPassword(password)){
            throw new ApiError(400, "Invalid credentials");
        }

        const { accessToken, refreshToken } = await generateToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            username: user.username,
            accessToken: accessToken,
            refreshToken: refreshToken
        }, "User logged in successfully"));

    } catch (err) {
        throw new ApiError(500, err.message);
    }
})