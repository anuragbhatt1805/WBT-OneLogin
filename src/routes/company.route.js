import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import { registerCompanyAndUser } from '../controller/company.controller.js';


export const companyRouter = express.Router();

companyRouter.post('/register/', upload.fields([
    {name: 'logo', maxCount: 1}
]), registerCompanyAndUser);