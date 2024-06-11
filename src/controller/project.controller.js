import { 
    UserGroup, User, Project, Fabricator, Task
 } from '../model/index.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createProject = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }
        console.log(req.body);

        const { name, description } = req.body;
        const { fabricator } = req.body;
        const { dueDate } = req.body;
        const { teamLeader } = req.body;
        const { modeler, modelerStart, modelerEnd  } = req.body;
        const { checker, checkerStart, checkerEnd } = req.body;
        const { erecter, erecterStart, erecterEnd } = req.body;
        const { detailer, detailerStart, detailerEnd } = req.body;

        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!name || !fabricator || !dueDate || !modeler || !checker || !erecter || !detailer || !teamLeader) {
            throw new ApiError(400, "All fields are required");
        }

        let fabricatorObject = await Fabricator.findById(fabricator);

        if (!fabricatorObject) {
            throw new ApiError(404, "Fabricator not found");
        }

        const modelerObject = await User.findById(modeler);
        const checkerObject = await User.findById(checker);
        const erecterObject = await User.findById(erecter);
        const detailerObject = await User.findById(detailer);
        const teamLeaderObject = await User.findById(teamLeader);

        if (!modelerObject) {
            throw new ApiError(404, "Modeler not found");
        }
        if (!checkerObject) {
            throw new ApiError(404, "Checker not found");
        }
        if (!erecterObject) {
            throw new ApiError(404, "Erecter not found");
        }
        if (!detailerObject) {
            throw new ApiError(404, "Detailer not found");
        }
        if (!teamLeaderObject) {
            throw new ApiError(404, "Team Leader not found");
        }

        const teamLeadGroup = await UserGroup.findById(teamLeaderObject.userGroup);

        if (!teamLeadGroup && teamLeadGroup.accessLevel !== "team_lead") {
            throw new ApiError(404, "Team Leader group not found");
        }

        const project = await Project.create({
            name: name.trim(),
            description: description? description.trim() : '',
            fabricator: fabricatorObject._id,
            dueDate: new Date(dueDate),
            modeler: {
                user: modelerObject._id,
                startDate: new Date(modelerStart),
                endDate: new Date(modelerEnd)
            },
            checker: {
                user: checkerObject._id,
                startDate: new Date(checkerStart),
                endDate: new Date(checkerEnd)
            },
            erecter: {
                user: erecterObject._id,
                startDate: new Date(erecterStart),
                endDate: new Date(erecterEnd)
            },
            detailer: {
                user: detailerObject._id,
                startDate: new Date(detailerStart),
                endDate: new Date(detailerEnd)
            },
            teamLeader: teamLeaderObject._id,
            created_by: req.user._id
        });

        // const modelerTask = await Task.create({
        //     title: `${name} - Modeler`,
        //     description: description? description.trim() : `Modeling for ${name}`,
        //     startDate: new Date(modelerStart),
        //     dueDate: new Date(modelerEnd),
        //     project: project._id,
        //     createdBy: req.user._id,
        //     currentUser: modelerObject._id,
        // })
        // modelerTask.assign.push({
        //     assignedTo: modelerObject._id,
        //     assignedBy: req.user._id,
        //     approved: true
        // })
        // await modelerTask.save();

        // const checkerTask = await Task.create({
        //     title: `${name} - Checker`,
        //     description: description? description.trim() : `Checking for ${name}`,
        //     startDate: new Date(checkerStart),
        //     dueDate: new Date(checkerEnd),
        //     project: project._id,
        //     createdBy: req.user._id,
        //     currentUser: checkerObject._id,
        // })
        // checkerTask.assign.push({
        //     assignedTo: checkerObject._id,
        //     assignedBy: req.user._id,
        //     approved: true
        // })
        // await checkerTask.save();

        // const erecterTask = await Task.create({
        //     title: `${name} - Erecter`,
        //     description: description? description.trim() : `Erecting for ${name}`,
        //     startDate: new Date(erecterStart),
        //     dueDate: new Date(erecterEnd),
        //     project: project._id,
        //     createdBy: req.user._id,
        //     currentUser: erecterObject._id,
        // })
        // erecterTask.assign.push({
        //     assignedTo: erecterObject._id,
        //     assignedBy: req.user._id,
        //     approved: true
        // })
        // await erecterTask.save();

        // const detailerTask = await Task.create({
        //     title: `${name} - Detailer`,
        //     description: description? description.trim() : `Detailing for ${name}`,
        //     startDate: new Date(detailerStart),
        //     dueDate: new Date(detailerEnd),
        //     project: project._id,
        //     createdBy: req.user._id,
        //     currentUser: detailerObject._id,
        // })
        // detailerTask.assign.push({
        //     assignedTo: detailerObject._id,
        //     assignedBy: req.user._id,
        //     approved: true
        // })
        // await detailerTask.save();

        return res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const getProject = asyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError(400, "Project ID is required");
        }

        const project = await Project.findById(projectId)
            .populate('fabricator modeler checker erecter detailer teamLeader')
            .populate('modeler.user')
            .populate('checker.user')
            .populate('erecter.user')
            .populate('detailer.user')
            .populate('created_by');

        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        return res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const getProjectAllProjects = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const data = {};

        if ("fabricator" in req.query) {
            data.fabricator = req.query.fabricator;
        }

        if ("dueDate" in req.query) {
            data.dueDate = {
                $lte: new Date(req.query.dueDate)
            };
        }

        if ("teamLeader" in req.query) {
            data.teamLeader = req.query.teamLeader;
        }

        if ("modeler" in req.query) {
            data.modeler.user = req.query.modeler;
        }

        if ("checker" in req.query) {
            data.checker.user = req.query.checker;
        }

        if ("erecter" in req.query) {
            data.erecter.user = req.query.erecter;
        }

        if ("detailer" in req.query) {
            data.detailer.user = req.query.detailer;
        }

        if ("created_by" in req.query) {
            data.created_by = req.query.created_by;
        }

        if ("active" in req.query) {
            data.active = req.query.active;
        }

        if ("stage" in req.query) {
            data.stage = req.query.stage;
        }

        if ("status" in req.query) {
            data.status = req.query.status;
        }

        const projects = await Project.find(data)
            .populate('fabricator modeler checker erecter detailer teamLeader')
            .populate('modeler.user')
            .populate('checker.user')
            .populate('erecter.user')
            .populate('detailer.user')
            .populate('created_by');

        return res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const updateProject = asyncHandler(async (req, res) => {
    try {
        console.log(req.body)
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        // if (!req.user.verified){
        //     throw new ApiError(400, "User not verified");
        // }

        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError(400, "Project ID is required");
        }

        const project = await Project.findById(projectId);

        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        const data = {};

        if ("name" in req.body) {
            throw new ApiError(400, "Project name cannot be updated");
        }

        if ("description" in req.body) {
            data.description = req.body.description;
        }

        if ("fabricator" in req.body){
            const fabricator = await Fabricator.findById("fabricator");
            if (!fabricator) {
                throw new ApiError(404, "Fabricator not found");
            }
            data.fabricator = fabricator._id;
        }

        if ("dueDate" in req.body) {
            data.dueDate = new Date(req.body.dueDate);
        }

        if ("teamLeader" in req.body) {
            const teamLeader = await User.findById(req.body.teamLeader);
            if (!teamLeader) {
                throw new ApiError(404, "Team Leader not found");
            }
            data.teamLeader = teamLeader._id;
        }

        if ("stage" in req.body){
            data.stage = req.body.stage;
        }

        if ("status" in req.body){
            data.status = req.body.status;
        }

        if ("modeler" in req.body) {
            const modeler = await User.findById(req.body.modeler);
            if (!modeler) {
                throw new ApiError(404, "Modeler not found");
            }
            data.modeler = {
                user: modeler._id
            };
        }

        if ("checker" in req.body) {
            const checker = await User.findById(req.body.checker);
            if (!checker) {
                throw new ApiError(404, "Checker not found");
            }
            data.checker = {
                user: checker._id
            };
        }

        if ("erecter" in req.body) {
            const erecter = await User.findById(req.body.erecter);
            if (!erecter) {
                throw new ApiError(404, "Erecter not found");
            }
            data.erecter = {
                user: erecter._id
            };
        }

        if ("detailer" in req.body) {
            const detailer = await User.findById(req.body.detailer);
            if (!detailer) {
                throw new ApiError(404, "Detailer not found");
            }
            data.detailer = {
                user: detailer._id
            };
        }

        if ("modelerStart" in req.body) {
            data.modeler.startDate = new Date(req.body.modelerStart);
        }

        if ("checkerStart" in req.body) {
            data.checker.startDate = new Date(req.body.checkerStart);
        }

        if ("erecterStart" in req.body) {
            data.erecter.startDate = new Date(req.body.erecterStart);
        }

        if ("detailerStart" in req.body) {
            data.detailer.startDate = new Date(req.body.detailerStart);
        }

        const updatedProject = await Project.findByIdAndUpdate(project._id, data, { new: true })
        .populate('fabricator modeler checker erecter detailer teamLeader');

        return res.status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"));

    } catch (err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
});