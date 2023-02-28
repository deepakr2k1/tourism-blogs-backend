const BlogModel = require('../Models/blog');
const internalServerError = 'Internal Server Error';
const unauthorized = `OOP! You don't access to perform this action.`;

const getAllBlogs = (async (req, res) => {
    try {
        const blogs = await BlogModel.find().sort({ date: -1 });
        res.status(200).send({ blogs });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err, msg: internalServerError });
    }
});

const getBlogById = (async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await BlogModel.findOne({ _id: id });
        res.status(200).send(blog);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err, msg: internalServerError });
    }
});

const createBlog = (async (req, res) => {
    try {
        const blog = new BlogModel(req.body);
        if (blog.content && !blog.snippet) {
            if (blog.content.length > 50) {
                blog.snippet = `${blog.content.substring(0, 50)}...`;
            } else {
                blog.snippet = blog.content;
            }
        }
        await BlogModel.create(blog);
        res.status(201).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err, msg: internalServerError });
    }
});

const updateBlog = (async (req, res) => {
    try {
        const id = req.params.id;
        const blog = new BlogModel(req.body);
        if (blog.content && !blog.snippet) {
            if (blog.content.length > 50) {
                blog.snippet = `${blog.content.substring(0, 50)}...`;
            } else {
                blog.snippet = blog.content;
            }
        }
        await BlogModel.updateOne({ _id: id }, blog);
        res.status(201).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err, msg: internalServerError });
    }
});

const deleteBlog = (async (req, res) => {
    try {
        const id = req.params.id;
        // todo: update userId
        const userId = '63f3e654d006e60ef040b51a';
        const blog = await BlogModel.findOne({ _id: id });
        if (userId != blog.author) return res.status(401).send({ msg: unauthorized });
        await BlogModel.deleteOne({ _id: id, author: userId });
        res.status(204).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err, msg: internalServerError });
    }
});

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};