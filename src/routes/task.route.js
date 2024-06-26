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
    getTaskById,
    getApproveTaskLisk,
    updateTask
} from '../controller/task.controller.js';

export const taskRouter = express.Router();

taskRouter.post('/create/', auth, createTask);

taskRouter.get('/', auth, getTask);

taskRouter.get('/all', auth, getAllTask);

taskRouter.get('/assign/all', auth, getApproveTaskLisk);

taskRouter.get('/:taskId/', auth, getTaskById);

taskRouter.get('/:taskId/accept/', auth, acceptTask);

taskRouter.post('/:taskId/approve/', auth, approveTask);

taskRouter.post('/:taskId/assign/', auth, assignTask);

taskRouter.post('/:taskId/update/', auth, updateTask);

taskRouter.get('/:taskId/comments/', auth, getTaskComments);

taskRouter.post('/:taskId/addComment/', auth, upload.array('file'), commentTask);