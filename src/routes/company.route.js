import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import { 
    registerCompanyAndUser,
    viewYourCompany, viewCompanyById
 } from '../controller/company.controller.js';


export const companyRouter = express.Router();

// GET
companyRouter.get('/', auth, viewYourCompany);
companyRouter.get('/:id/', viewCompanyById);

companyRouter.post('/register/', upload.fields([
    {name: 'logo', maxCount: 1}
]), registerCompanyAndUser);

// npm start-local --host 0.0.0.0