import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import {
    createTask,
    assignTask,
    acceptTask,
    approveTask,
    getTask,
    getAllTask,
    commentTask,
    getTaskComments,
} from '../controller/task.controller.js';

export const taskRouter = express.Router();

taskRouter.post('/create/', auth, createTask);

taskRouter.get('/', auth, getTask);

taskRouter.get('/all', auth, getAllTask);

taskRouter.get('/:taskId/accept/', auth, acceptTask);

taskRouter.post('/:taskId/approve/', auth, approveTask);

taskRouter.post('/:taskId/assign/', auth, assignTask);

taskRouter.get('/:taskId/comments/', auth, getTaskComments);

taskRouter.post('/:taskId/addComment/', auth, upload.array('file'), commentTask);