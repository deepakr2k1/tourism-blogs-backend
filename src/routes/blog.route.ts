import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import auth from '../middlewares/auth.middleware'

const blogRouter = Router();

blogRouter.get('/', blogController.getAllBlogs);
blogRouter.get('/:id', blogController.getBlogById);
blogRouter.post('/create', auth, blogController.createBlog);
blogRouter.post('/:id', auth, blogController.updateBlog);
blogRouter.delete('/:id', auth, blogController.deleteBlog);

export default blogRouter;