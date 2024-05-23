import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true
    },
    fieldType: {
        type: String,
        required: true,
        enum: ["text", "number", "date", "boolean", "list", "object", "file"]
    },
    fieldRequired: {
        type: Boolean,
        required: true
    },
    fieldUnique: {
        type: Boolean,
        required: true
    },
    fieldDefault: [
        {
            type: String
        }
    ],
})

export const UserGroup_Schema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    userGroupName: {
        type: String,
        required: true
    },
    userGroupDescription: {
        type: String
    },
    accessLevel: {
        type: String,
        required: true,
        enum: ["admin", "manager", "team_lead", "team_manager", "user", "guest"]
    },
    userGroupSchema: [
        UserSchema
    ]
}, {
    timestamps: true,
})