import * as Redis from 'redis';
import blogInterface from '../interfaces/blog.interface';
import { DEFAULT_CACHE_EXPIRATION } from '../config';

const blogCache  = Redis.createClient();
blogCache.connect()
    .then(() => { console.info(`Connected to Redis Server - blogCache`) })
    .catch((err) => { console.error(err) });

export const getCachedBlog = async(req: Req, res: Res, next: Next) => {
    try {
        let blogId = req.params.id;
        let blog = await blogCache.get(blogId);
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
        await blogCache.setEx(blogId, DEFAULT_CACHE_EXPIRATION, JSON.stringify(blog));
    } catch(err) {
        console.error(err);
    }
}

export const deleteBlogCache = async(blogId: string) => {
    try {
        await blogCache.del(blogId);
    } catch(err) {
        console.error(err);
    }
}