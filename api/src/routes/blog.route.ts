import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import auth from '../middlewares/auth.middleware';
import { getCachedBlogsList } from '../cache/listBlogs.cache';
import { getCachedBlog } from '../cache/blog.cache';

const blogRouter = Router();

blogRouter.get('/', getCachedBlogsList, blogController.getAllBlogs);
blogRouter.get('/:id', getCachedBlog, blogController.getBlogById);
blogRouter.post('/create', auth, blogController.createBlog);
blogRouter.post('/:id', auth, blogController.updateBlog);
blogRouter.delete('/:id', auth, blogController.deleteBlog);

export default blogRouter;