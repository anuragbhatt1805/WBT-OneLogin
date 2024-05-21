import path from "path";

import { Company, UserGroup, User, OTP } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendOTP } from "../utils/mail.util.js";

import { generateToken } from "./user.controller.js";

export const registerCompanyAndUser = asyncHandler(async (req, res) => {
    try {
        const {
            name, id, email, colorCode, phone,
            address, website, established, type, size, country,
            username, password
        } = req.body;
        const logo = `/uploads/${path.basename(req?.files?.logo[0]?.path)}`;
        
        if (!name || !id || !email || !phone){
            throw new ApiError(400, "Please fill all required fields for Company");
        }

        if (!username || !password){
            throw new ApiError(400, "Please fill all required fields for User");
        }

        if (!req?.files?.logo){
            throw new ApiError(400, "Please upload a logo for the Company");
        }

        const oldCompany = await Company.findOne({$or: [{companyName: name}, {companyId: id}]});

        if (oldCompany){
            throw new ApiError(400, "Company already exists with the same name or id");
        }
        
        const oldUser = await User.findOne({username:`${id}-${username}`});
        if (oldUser){
            throw new ApiError(400, "User already exists with the same username");
        }

        const company_info = {
            companyName: name,
            companyId: id.toUpperCase(),
            companyEmail: email,
            companyPhone: phone,
            companyLogo: logo
        };

        if (address) company_info.companyAddress = address;
        if (colorCode) {
            company_info.companyColorCode = {primary: colorCode.primary, secondary: colorCode.secondary}
        } else {
            company_info.companyColorCode = {primary: "#6adb45", secondary: "#858889"}
        };
        if (website) company_info.companyWebsite = website;
        if (established) company_info.companyEstablished = established;
        if (type) company_info.companyType = type;
        if (size) company_info.companySize = size;
        if (country) company_info.companyCountry = country;

        const company = await Company.create(company_info);

        if (!company){
            throw new ApiError(500, "Failed to register company");
        }

        const userGroup = await UserGroup.create({
            company: company._id,
            userGroupName: "Admin",
            userGroupDescription: "Admin of the Company",
            accessLevel: "admin",
            userGroupSchema: []
        })

        if (!userGroup){
            throw new ApiError(500, "Failed to create user group");
        }

        const user = await User.create({
            username: `${id}-${username}`,
            password: password,
            email: email,
            userGroup: userGroup._id
        });

        if (!user){
            throw new ApiError(500, "Failed to create user");
        }

        company.companyAdmin = user._id;
        await company.save();

        const otp = await OTP.create({
            user: user._id,
            otp: Math.floor(100000 + Math.random() * 900000)
        });

        if (!otp){
            throw new ApiError(500, "Failed to send OTP");
        }

        // TODO: Uncomment this line after integrating mail service
        // await sendOTP(email, name, otp.otp);

        const {accessToken, refreshToken} = await generateToken(user._id);

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
        }, "Company registered successfully, Please enter OTP for verification"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const viewYourCompany = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const company = await Company.findOne({companyAdmin: req.user._id}).select("-__v -companyColorCode.__id").populate("companyAdmin");

        if (!company){
            throw new ApiError(404, "Company not found");
        }
        return res.status(200).json(new ApiResponse(200, company, "Company found successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const viewCompanyById = asyncHandler(async (req, res) => {
    try {
        const company = await Company.findOne({companyId: req.params.id}).select("-__v -companyColorCode -companyId -companyAdmin").populate("companyAdmin");

        if (!company){
            throw new ApiError(404, "Company not found");
        }

        return res.status(200).json(new ApiResponse(200, company, "Company found successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});