import express from 'express';
import authUser from '../middlewares/auth.js';
import { loginUser, googleLogin, registerUser, updateUser, updateUserProfilePic } from '../controllers/userController.js';
import { upload } from '../config/multer.js';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter.js';

const userRouter = express.Router();

userRouter.post('/register', registerLimiter, registerUser);
userRouter.post('/google', googleLogin);
userRouter.post('/login', loginLimiter, loginUser);
userRouter.post('/update', authUser, updateUser);
userRouter.post('/update-profile-pic', upload.fields([{name: 'profile', maxCount: 1}]), authUser, updateUserProfilePic);
// userRouter.post('/update', upload.fields([{name: 'profile', maxCount: 1}, {name: 'cover', maxCount: 1}]), protect , updateUserData)

export default userRouter;