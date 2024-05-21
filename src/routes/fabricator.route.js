import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { 
    createFabricator, 
    getFabricatorsById,
    getAllFabricators
} from '../controller/fabricator.controller.js';


export const fabricatorRouter = express.Router();

fabricatorRouter.post('/create/', auth, createFabricator);

fabricatorRouter.get('/all/', auth, getAllFabricators);

fabricatorRouter.get('/:id/', auth, getFabricatorsById);
