const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;
const BlogModel = require('../models/blog');

const { MAX_SNIPPET_LENGTH } = require('../../config');
const { INTERNAL_SERVER_ERROR } = require('../utils/statusCodeResponses');

const getAllBlogs = (async (req, res) => {
    try {
        let blogs = await BlogModel.find().sort({ date: -1 });
        res.status(200).send({ blogs });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const getBlogById = (async (req, res) => {
    try {
        let id = req.params.id;
        let blog = await BlogModel.findOne({ _id: id }).populate('author');
        res.status(200).send(blog);
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const createBlog = (async (req, res) => {
    try {
        let blog = new BlogModel(req.body);
        blog.author = ObjectId(req.user.id);
        if (blog.content && !blog.snippet) {
            if (blog.content.length > MAX_SNIPPET_LENGTH) {
                blog.snippet = `${blog.content.substring(0, MAX_SNIPPET_LENGTH - 3)}...`;
            } else {
                blog.snippet = blog.content;
            }
        }
        await BlogModel.create(blog);
        res.status(201).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const updateBlog = (async (req, res) => {
    try {
        let userId = req.user.id;
        let blogId = req.params.id;
        let blog = await BlogModel.findOne({ _id: blogId });
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

const deleteBlog = (async (req, res) => {
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

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};