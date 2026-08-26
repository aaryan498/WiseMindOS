import express from 'express';
import authUser from '../middlewares/auth.js';
import { loginUser, googleLogin, registerUser, updateUser, updateUserProfilePic } from '../controllers/userController.js';
import { upload } from '../config/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/google', googleLogin);
userRouter.post('/login', loginUser);
userRouter.patch('/profile', authUser, updateUser);
userRouter.patch('/profile-picture', upload.fields([{ name: 'profile', maxCount: 1 }]), authUser, updateUserProfilePic);


export default userRouter;