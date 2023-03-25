import { Router } from 'express';
import blogRouter from './blog.route'
import userRouter from './user.route'

const rootRouter = Router();

rootRouter.use('/user', userRouter);
rootRouter.use('/blog', blogRouter);

export default rootRouter;