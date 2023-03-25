import blogInterface from '../interfaces/blog.interface';
import redisCache from './index';
import { DEFAULT_CACHE_EXPIRATION } from '../config';

export const getCachedBlog = async(req: Req, res: Res, next: Next) => {
    try {
        let blogId = req.params.id;
        let blog = await redisCache.get(`Blog_${blogId}`);
        if(blog !== null) {
            blog = JSON.parse(blog);
            return res.status(200).json(blog);
        }
        next();
    } catch(err) {
        console.error(err);
        next();
    }
}

export const cacheBlog = async(blogId: string, blog: blogInterface) => {
    try {
        await redisCache.setEx(`Blog_${blogId}`, DEFAULT_CACHE_EXPIRATION, JSON.stringify(blog));
    } catch(err) {
        console.error(err);
    }
}

export const deleteBlogCache = async(blogId: string) => {
    try {
        await redisCache.del(`Blog_${blogId}`);
    } catch(err) {
        console.error(err);
    }
}