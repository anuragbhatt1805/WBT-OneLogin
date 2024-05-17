import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import { 
    verifyUserViaOTP, getNewOTP
 } from '../controller/user.controller.js';

export const userRouter = express.Router();

userRouter.post('/verifyOtp/', auth, verifyUserViaOTP);
userRouter.get('/newOtp/', auth, getNewOTP);