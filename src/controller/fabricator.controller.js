import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Fabricator, User } from '../model/index.js';

export const createFabricator = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            throw new ApiError(400, 'Name is required');
        }

        const fabricator = await Fabricator.create({
            name: name,
            description: description? description : ''
        });

        if (!fabricator) {
            throw new ApiError(500, 'Fabricator not created');
        }

        return new ApiResponse(201, fabricator, 'Fabricator created successfully');
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export const getFabricatorsById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, 'Invalid Fabricator ID');
        }

        const fabricator = await Fabricator.findById(id);

        if (!fabricator) {
            throw new ApiError(404, 'Fabricator not found');
        }

        return new ApiResponse(200, fabricator, 'Fabricator found');
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export const getAllFabricators = asyncHandler(async (req, res) => {
    try {
        const fabricators = await Fabricator.find();

        if (!fabricators) {
            throw new ApiError(404, 'No Fabricators found');
        }

        return new ApiResponse(200, fabricators, 'Fabricators found');
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});