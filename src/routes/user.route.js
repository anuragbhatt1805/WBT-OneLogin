import express from 'express';
import { upload } from "../middleware/multer.middleware.js";
import { auth } from '../middleware/auth.middleware.js';
import { 
    verifyUserViaOTP, getNewOTP, login
 } from '../controller/user.controller.js';

export const userRouter = express.Router();

userRouter.get('/newOtp/', auth, getNewOTP);

userRouter.post('/login/', login);
userRouter.post('/verifyOtp/', auth, verifyUserViaOTP);