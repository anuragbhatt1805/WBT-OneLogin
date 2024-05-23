import { Company, UserGroup, User, OTP } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';


export const createNewGroup = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const { name, description, accessLevel } = req.body;
        const { groupSchema } = req.body;

        const companyExist = await Company.findById("664731d8e7b273696c95c368");

        if (!companyExist) {
            throw new ApiError(404, "Company not found");
        }

        const groupExist = await UserGroup.findOne({ company: companyExist._id, userGroupName: name });

        if (groupExist) {
            throw new ApiError(400, "Group already exists");
        }

        const group_data = await UserGroup.create({
            company: companyExist._id,
            userGroupName: name,
            userGroupDescription: description,
            accessLevel: accessLevel
        })

        for (let i = 0; i < groupSchema.length; i++) {
            group_data.userGroupSchema.push({
                fieldName: groupSchema[i].fieldName,
                fieldType: groupSchema[i].fieldType,
                fieldRequired: (groupSchema[i].fieldRequired)? groupSchema[i].fieldRequired : false,
                fieldUnique: (groupSchema[i].fieldUnique)? groupSchema[i].fieldUnique : false,
                fieldDefault: groupSchema[i].fieldDefault
            });
        }

        await group_data.save();

        const group = await UserGroup.findById(group_data._id).populate("company")
        .select("-__v -userGroupSchema.__id");

        if (!group) {
            throw new ApiError(500, "Error creating group");
        }

        return res.status(201).json(new ApiResponse(201, group, "Group created successfully"));

    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const getAllGroups = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const tempgroups = await UserGroup.findById(req.user.userGroup).select("-__v -userGroupSchema.__id");

        const data = {
            company: tempgroups.company,
        }

        if ("access" in req.query){
            data.accessLevel = req.query.access;
        }

        const allGroups = await UserGroup.find(data).populate("company");

        if (!allGroups) {
            throw new ApiError(404, "No groups found");
        }

        return res.status(200).json(new ApiResponse(200, allGroups, "Groups retrieved successfully"));

    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const getGroup = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const group = await UserGroup.findById(req.params.groupId).populate("company");

        if (group) {
            return res.status(200).json(new ApiResponse(200, group, "Group retrieved successfully"));
        } else {
            throw new ApiError(404, "Group not found");
        }
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const updateGroup = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const data = {};

        if ("name" in req.body){
            data.userGroupName = req.body.name;
        }

        if ("description" in req.body){
            data.userGroupDescription = req.body.description;
        }

        if ("accessLevel" in req.body){
            data.accessLevel = req.body.accessLevel;
        }

        const group = await UserGroup.findByIdAndUpdate(req.params.groupId, data, { new: true });
        await group.save();

        if ("groupSchema" in req.body) {
            for (let i = 0; i < req.body.groupSchema.length; i++) {
                const fieldName = req.body.groupSchema[i].fieldName;
                const fieldType = req.body.groupSchema[i].fieldType;
                const fieldRequired = req.body.groupSchema[i].fieldRequired ? req.body.groupSchema[i].fieldRequired : false;
                const fieldUnique = req.body.groupSchema[i].fieldUnique ? req.body.groupSchema[i].fieldUnique : false;
                const fieldDefault = req.body.groupSchema[i].fieldDefault;
        
                const existingSchemaIndex = group.userGroupSchema.findIndex(schema => schema.fieldName === fieldName);
        
                if (existingSchemaIndex !== -1) {
                    group.userGroupSchema[existingSchemaIndex].fieldType = fieldType;
                    group.userGroupSchema[existingSchemaIndex].fieldRequired = fieldRequired;
                    group.userGroupSchema[existingSchemaIndex].fieldUnique = fieldUnique;
                    group.userGroupSchema[existingSchemaIndex].fieldDefault = fieldDefault;
                } else {
                    group.userGroupSchema.push({
                        fieldName: fieldName,
                        fieldType: fieldType,
                        fieldRequired: fieldRequired,
                        fieldUnique: fieldUnique,
                        fieldDefault: fieldDefault
                    });
                }
            }
            await group.save();
        }
        

        return res.status(200).json(new ApiResponse(200, group, "Group updated successfully"));

    } catch (err) {
        throw new ApiError(500, err.message);
    }
});