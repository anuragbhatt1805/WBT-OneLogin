import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Fabricator, User } from '../model/index.js';

export const createFabricator = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const { fabricatorName, clientName, clientPhone } = req.body;

        if (!fabricatorName || !clientName || !clientPhone) {
            throw new ApiError(400, 'All fields are required');
        }

        const fabricator = await Fabricator.create({
            name: fabricatorName,
            clientName: clientName,
            clientPhone: clientPhone
        });

        if (!fabricator) {
            throw new ApiError(500, 'Fabricator not created');
        }

        return res.status(200)
        .json(new ApiResponse(201, fabricator, 'Fabricator created successfully'));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export const getFabricatorsById = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, 'Invalid Fabricator ID');
        }

        const fabricator = await Fabricator.findById(id);

        if (!fabricator) {
            throw new ApiError(404, 'Fabricator not found');
        }

        return res.status(200)
        .json(new ApiResponse(200, fabricator, 'Fabricator found'));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export const getAllFabricators = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }
        
        const fabricators = await Fabricator.find();

        if (!fabricators) {
            throw new ApiError(404, 'No Fabricators found');
        }

        return res.status(200)
        .json(new ApiResponse(200, fabricators, 'Fabricators found'));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export const updateFabricator = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, 'Invalid Fabricator ID');
        }

        const updatedData = {}

        if ("fabricatorName" in req.body){
            updatedData.name = req.body.fabricatorName;
        }

        if ("clientName" in req.body){
            updatedData.clientName = req.body.clientName;
        }

        if ("clientPhone" in req.body){
            updatedData.clientPhone = req.body.clientPhone;
        }

        const fabricator = await Fabricator.findByIdAndUpdate(id, updatedData, { new: true });

        if (!fabricator) {
            throw new ApiError(404, 'Fabricator not found');
        }

        return res.status(200)
       .json(new ApiResponse(200, fabricator, 'Fabricator updated successfully'));

    } catch (error) {
console.log(error);
        throw new ApiError(500, error.message);
    }
});