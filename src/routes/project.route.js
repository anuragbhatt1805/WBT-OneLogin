import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import {
    createProject,
    getProjectAllProjects,
    getProject,
} from '../controller/project.controller.js';

export const projectRouter = express.Router();

projectRouter.post('/create/', auth, createProject);
projectRouter.get('/all/', auth, getProjectAllProjects);
projectRouter.get('/:projectId', auth, getProject);