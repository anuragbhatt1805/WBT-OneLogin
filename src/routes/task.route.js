import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import {
    createTask,
    assignTask,
    approveTask,
    getTask,
    getAllTask,
    // getTaskByProject,
    // getTaskByUser,
    // getTaskByFabricator,
    commentTask,
    getTaskComments,
} from '../controllers/task.controller.js';

export const taskRouter = express.Router();