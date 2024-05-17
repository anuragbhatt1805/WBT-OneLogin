import { Company, UserGroup, User, OTP } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';


export const createNewGroup = asyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized");
        }

        const { company, name, description, accessLevel } = req.body;
        const { groupSchema } = req.body;

        const companyExist = await Company.findById(company);

        if (!companyExist) {
            throw new ApiError(404, "Company not found");
        }

        const groupExist = await UserGroup.findOne({ company: company, userGroupName: name });

        if (groupExist) {
            throw new ApiError(400, "Group already exists");
        }

        const group_data = await UserGroup.create({
            company: company,
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