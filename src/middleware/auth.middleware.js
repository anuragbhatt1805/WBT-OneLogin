import { ApiError } from "../utils/apiError.js";
import { User } from "../model/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { logError } from "../utils/log.util.js";

export const auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.accessToken || req?.headers("Authorization")?.replace("Bearer ", "");
        console.log(token);
        console.log(req?.cookies);
        console.log(req?.headers)

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken -__v");

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = user;
        next();
    } catch (error) {
        logError("Error logging out user", error);
        throw new ApiError(401, "Token expired or invalid");
    }
});