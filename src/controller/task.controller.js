import path from "path";

import { 
    UserGroup, User, Project, Fabricator, Task
 } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createTask = asyncHandler(async (req, res) => {
    try {

        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }
        // console.log(req.body);
        const { project, assignedUser, title, description, startDate, dueDate, priority } = req.body;

        if (!project || !assignedUser || !title || !description || !startDate || !dueDate || !priority) {
            throw new ApiError(400, "All fields are required");
        }

        const projectObject = await Project.findById(project);

        if (!projectObject) {
            throw new ApiError(404, "Project not found");
        }

        const assignedTo = await User.findById(assignedUser);

        if (!assignedTo) {
            throw new ApiError(404, "Assigned user not found");
        }

        const task = await Task.create({
            project: projectObject._id,
            createdBy: req.user._id,
            currentUser: assignedTo._id,
            title: title.trim(),
            priority: Number.parseInt(priority),
            description: description.trim(),
            startDate: new Date(startDate),
            dueDate : new Date(dueDate),
        });

        task.assign.push({
            assignedTo: assignedTo._id,
            assignedBy: req.user._id,
            approved: true
        });

        await task.save();

        return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message);
    }
});

export const getTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const task = await Task.findOne({currentUser: req.user._id, status: {$ne: "complete"}}).sort({priority: -1}).populate('project').populate('createdBy').populate('currentUser').populate('assign.assignedTo').populate('assign.assignedBy').populate('comments.commentedBy');

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const getAllTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const data = {}

        if ("project" in req.query) {
            data.project = req.query.project;
        }

        if ("fabricator" in req.query) {
            data.project.fabricator = req.query.fabricator;
        }

        if ("createdBy" in req.query) {
            data.createdBy = req.query.createdBy;
        }

        if ("priority" in req.query) {
            switch (req.query.priority.toLowerCase()) {
                case "critical":
                    data.priority = 4;
                    break;

                case "high":
                    data.priority = 3;
                    break;

                case "medium":
                    data.priority = 2;
                    break;
            
                default:
                    data.priority = 1;
                    break;
            }
        }

        if ("status" in req.query) {
            data.status = req.query.status;
        }

        const task = await Task.find(data).sort({priority: -1}).populate('project').populate('createdBy').populate('currentUser').populate('assign.assignedTo').populate('assign.assignedBy').populate('comments.commentedBy').populate({path:"project", populate:{path:"fabricator"}});

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const acceptTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        if (task.currentUser.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not allowed to perform this action");
        }

        task.status = "in progress";
        await task.save();

        return res.status(200).json(new ApiResponse(200, task, "Task accepted successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const approveTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        
        const project = await Project.findById(task.project);
        
        if (req.user._id.toString() !== task.createdBy.toString() || req.user._id.toString() !== project.teamLeader.toString()) {
            throw new ApiError(403, "You are not allowed to perform this action");
        }
        
        const taskAssign = await task.assign.find(assign => assign._id.toString() === req.body.assignId);
        
        if (!taskAssign) {
            throw new ApiError(404, "Task assign request not found");
        }

        taskAssign.approved = true;
        task.currentUser = taskAssign.assignedTo;
        // await taskAssign.save();
        await task.save();

        return res.status(200).json(new ApiResponse(200, task, "Task approved successfully"));

    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const assignTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        const project = await Project.findById(task.project);

        if (task.currentUser.toString() !== req.user._id.toString() 
            && task.createdBy.toString() !== req.user._id.toString()
            && project.teamLeader.toString() !== req.user._id.toString()){
            throw new ApiError(403, "You are not allowed to perform this action");
        }

        const {assignedUser} = req.body;

        const user = await User.findById(assignedUser);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        task.assign.push({
            assignedTo: user._id,
            assignedBy: req.user._id,
            approved: false
        });

        await task.save();

        return res.status(200).json(new ApiResponse(200, task, "Task assigned successfully, waiting for approval"));
    } catch (err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});

export const getTaskComments = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const task = await Task.findById(req.params.taskId).populate('comments.commentedBy');

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        return res.status(200).json(new ApiResponse(200, task.comments, "Task comments fetched successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const commentTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        console.log(req.body);

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        const {text} = req.body;
        const files = req?.files?.map(file => path.join("/uploads", file.filename));

        task.comments.push({
            commentedBy: req.user._id,
            text: text.trim(),
            files: files? files : []
        });

        await task.save();

        return res.status(200).json(new ApiResponse(200, task, "Task comment added successfully"));
    } catch (err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});

export const getTaskById = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const task = await Task.findById(req.params.taskId).populate('project').populate('createdBy').populate('currentUser').populate('assign.assignedTo').populate('assign.assignedBy').populate('comments.commentedBy');

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const getApproveTaskLisk = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const results = await Task.aggregate([
            // Unwind the assign array to deconstruct it
            { $unwind: '$assign' },
            // Match documents where assign.approved is false
            { $match: { 'assign.approved': false } },
            // Lookup project details
            {
            $lookup: {
                from: 'projects',
                localField: 'project',
                foreignField: '_id',
                as: 'projectDetails'
            }
            },
            {
            $lookup: {
                from: 'users',
                localField: 'projectDetails.teamLeader',
                foreignField: '_id',
                as: 'teamLeaderDetails'
            }
            },
            // Lookup user details for assignedTo
            {
            $lookup: {
            from: 'users',
            localField: 'assign.assignedTo',
            foreignField: '_id',
            as: 'assignedToDetails'
            }
            },
            // Lookup user details for assignedBy
            {
            $lookup: {
            from: 'users',
            localField: 'assign.assignedBy',
            foreignField: '_id',
            as: 'assignedByDetails'
            }
            },
            // Project the required fields
            {
            $project: {
            _id: 0,
            taskId: '$_id',
            taskTitle: '$title',
            assignId: '$assign._id',
            assignedTo: {
            $arrayElemAt: ['$assignedToDetails', 0]
            },
            assignedBy: {
            $arrayElemAt: ['$assignedByDetails', 0]
            },
            project: {
            $arrayElemAt: ['$projectDetails', 0]
            },
            teamLeader: {
            $arrayElemAt: ['$teamLeaderDetails', 0]
            },
            status: '$status'
            }
            }
        ]);

        return res.status(200).json(new ApiResponse(200, results, "Tasks fetched successfully"));
    } catch (err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
})

export const updateTask = asyncHandler( async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }
        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        const { title, description, startDate, dueDate, priority, status } = req.body;

        data = {
            title: title? title?.trim() : task.title,
            description: description? description?.trim() : task.description,
            startDate: startDate? new Date(startDate) : task.startDate,
            dueDate: dueDate? new Date(dueDate) : task.dueDate,
            priority: priority? Number.parseInt(priority.trim()) : task.priority,
            status: status? status?.trim()?.toLowerCase() : task.status
        }

        task = await Task.findByIdAndUpdate(task._id, data, { new: true });

        return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
    } catch (err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});