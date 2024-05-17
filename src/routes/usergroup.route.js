import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
    createNewGroup
} from '../controller/usergroup.controller.js'

export const groupRouter = express.Router();

groupRouter.post('/create/', auth, createNewGroup);