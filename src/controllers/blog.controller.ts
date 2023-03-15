import BlogModel from '../models/blog.model'
import * as _ from 'lodash'
import { Req, Res } from '../interfaces/global.interface'
import { ObjectId } from 'mongodb'

import { MAX_SNIPPET_LENGTH } from '../config';
import { INTERNAL_SERVER_ERROR } from '../utils/statusCodeResponses';
import { PAGE_SIZE } from '../utils/constants';

export const getAllBlogs = (async (req: Req, res: Res) => {
    try {
        let page: number = req.query.page ? parseInt(req.query.page as string) : 0;
        const blogs = await BlogModel.find()
            .limit(PAGE_SIZE)
            .skip(PAGE_SIZE * page)
            .sort({ updated_at: -1 });
        res.status(200).send({ blogs });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

export const getBlogById = (async (req: Req, res: Res) => {
    try {
        let id = req.params.id;
        let blog = await BlogModel.findOne({ _id: id }).populate('author');
        res.status(200).send(blog);
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

export const createBlog = (async (req: Req, res: Res) => {
    try {
        let blog = new BlogModel(req.body);
        blog.author = new ObjectId(req.user.id);
        if (blog.content && !blog.snippet) {
            if (blog.content.length > MAX_SNIPPET_LENGTH) {
                blog.snippet = `${blog.content.substring(0, MAX_SNIPPET_LENGTH - 3)}...`;
            } else {
                blog.snippet = blog.content;
            }
        }
        await BlogModel.create(blog);
        return res.status(201).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

export const updateBlog = (async (req: Req, res: Res) => {
    try {
        let userId = req.user.id;
        let blogId = req.params.id;
        let blog = await BlogModel.findOne({ _id: blogId });
        console.log(userId)
        console.log(typeof(userId))
        console.log(blog.author)
        console.log(typeof(blog.author))
        if (userId != (blog && blog.author)) return res.status(401).send({ msg: `OOP! You don't access to perform this action.` });
        blog = new BlogModel(req.body);
        if (blog.content && !blog.snippet) {
            if (blog.content.length > MAX_SNIPPET_LENGTH) {
                blog.snippet = `${blog.content.substring(0, MAX_SNIPPET_LENGTH - 3)}...`;
            } else {
                blog.snippet = blog.content;
            }
        }
        blog = _.pick(blog, ['title', 'content', 'snippet']);
        await BlogModel.updateOne({ _id: blogId }, blog);
        res.status(201).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

export const deleteBlog = (async (req: Req, res: Res) => {
    try {
        let userId = req.user.id;
        let blogId = req.params.id;
        let blog = await BlogModel.findOne({ _id: blogId });
        if (userId != (blog && blog.author)) return res.status(401).send({ msg: `OOP! You don't access to perform this action.` });
        await BlogModel.deleteOne({ _id: blogId, author: userId });
        res.status(204).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});