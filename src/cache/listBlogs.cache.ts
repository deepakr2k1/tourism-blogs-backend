import * as Redis from 'redis';
import blogInterface from '../interfaces/blog.interface';
import { DEFAULT_CACHE_EXPIRATION } from '../config';

const listBlogsCache  = Redis.createClient();
listBlogsCache.connect()
    .then(() => { console.info(`Connected to Redis Server - listBlogsCache`) })
    .catch((err) => { console.error(err) });

export const getAllCachedBlogs = async(req: Req, res: Res, next: Next) => {
    try {
        let page: number = req.query.page ? parseInt(req.query.page as string) : 0;
        let allBlogs = await listBlogsCache.get(`LIST_BLOGS_${page}`);
        if(allBlogs !== null) {
            allBlogs = JSON.parse(allBlogs);
            return res.status(200).json({ allBlogs });
        }
        next();
    } catch(err) {
        console.error(err);
        next();
    }
}

export const cacheAllBlogs = async(page: number, allBlogs: blogInterface[]) => {
    try {
        await listBlogsCache.setEx(`LIST_BLOGS_${page}`, DEFAULT_CACHE_EXPIRATION, JSON.stringify(allBlogs));
    } catch(err) {
        console.error(err);
    }
}

export const clearAllBlogsCache = async() => {
    try {
        await listBlogsCache.flushAll();
    } catch(err) {
        console.error(err);
    }
}