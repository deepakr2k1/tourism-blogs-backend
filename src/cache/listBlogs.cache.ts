import blogInterface from '../interfaces/blog.interface';
import redisCache from './index';

export const getCachedBlogsList = async(req: Req, res: Res, next: Next) => {
    try {
        let page: number = req.query.page ? parseInt(req.query.page as string) : 0;
        let allBlogs = await redisCache.hGet(`LIST_BLOGS`, `${page}`);
        if(allBlogs !== null && allBlogs !== undefined) {
            allBlogs = JSON.parse(allBlogs);
            return res.status(200).json({ allBlogs });
        }
        next();
    } catch(err) {
        console.error(err);
        next();
    }
}

export const cacheBlogsList = async(page: number, allBlogs: blogInterface[]) => {
    try {
        await redisCache.hSet(`LIST_BLOGS`, `${page}`, JSON.stringify(allBlogs));
    } catch(err) {
        console.error(err);
    }
}

export const clearBlogsListCache = async() => {
    try {
        await redisCache.del(`LIST_BLOGS`);
    } catch(err) {
        console.error(err);
    }
}