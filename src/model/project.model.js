import mongoose from "mongoose";

const Team_Work_Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Number,
        default: 0
    }
})

export const Project_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fabricator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fabricator',
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        required: true
    },
    modeler: {
        type: Team_Work_Schema,
    },
    checker: {
        type: Team_Work_Schema,
    },
    erecter: {
        type: Team_Work_Schema,
    },
    detailer: {
        type: Team_Work_Schema,
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    stage: {
        type: String,
        default: 'IFA',
        enum: ['IFA', 'BFA', 'RIFA', 'BFA', 'IFC', 'REV'] 
    },
    status: {
        type: String,
        default: 'ON-HOLD',
        enum: ['ON-HOLD', 'APPROVED', 'COMPLETED']
    }
}, {
    timestamps: true
});