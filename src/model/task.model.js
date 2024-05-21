import mongoose from "mongoose";

const TaskAssign_Schema = new mongoose.Schema({
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Comment_Schema = new mongoose.Schema({
    text: {
        type: String
    },
    file: [{
        type: String,
    }],
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export const Task_Schema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    startDate: {
        type: Date,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
    priority: {
        type: Number,
        default: 2
    },
    status: {
        type: String,
        default: 'pending'
    },
    comments: [Comment_Schema],
    assign: [TaskAssign_Schema],
}, {
    timestamps: true
});