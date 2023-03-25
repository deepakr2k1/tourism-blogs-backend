import { Router } from "express";
import auth from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.get('/verifyEmail', userController.verifyEmail);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.get('/profile', auth, userController.profile);

export default userRouter;