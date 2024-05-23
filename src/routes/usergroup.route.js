import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
    createNewGroup, getAllGroups, getGroup, updateGroup
} from '../controller/usergroup.controller.js'

export const groupRouter = express.Router();

groupRouter.post('/create/', auth, createNewGroup);

groupRouter.get('/all/', auth, getAllGroups);

groupRouter.get('/:groupId', auth, getGroup);

groupRouter.put('/:groupId/update', auth, updateGroup);