// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const Blog = require('../Models/blog');
const ObjectId = require('mongodb').ObjectId;

const blog_index = ((req, res) => {
    Blog.find().sort({ date: -1 })
        .then(result => {
            var user = {
                'name': req.cookies["name"],
                'email': req.cookies["email"],
            }
            res.render('blogs/index', { user: user, title: 'Blogs', blogs: result });
        })
        .catch(err => {
            console.log(err);
        })
})

const blog_details = ((req, res) => {
    var user = {
        'name': req.cookies["name"],
        'email': req.cookies["email"],
    }
    const id = new ObjectId(req.params.id);
    Blog.findById(id)
        .then((result) => {
            res.render('blogs/details', { user: user, 'blog': result, title: 'Blog Details' })
        })
        .catch((err) => {
            res.render('404', { user: user, title: 'Not Found' })
            console.log(err);
        })
})

const blog_create_get = ((req, res) => {
    var user = {
        'name': req.cookies["name"],
        'email': req.cookies["email"],
    }
    if (user.email == null || req.cookies["email"] == "") res.redirect('/user');
    else res.render('blogs/create', { user: user, title: 'Create New Blog' });
})

const blog_create_post = ((req, res) => {
    if (req.cookies["email"] == null || req.cookies["email"] == "") res.redirect('/user');
    const blog = new Blog(req.body);
    blog.date = new Date();
    blog.author = req.cookies["email"];
    blog.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
})

const blog_edit_get = ((req, res) => {

    var user = {
        'name': req.cookies["name"],
        'email': req.cookies["email"],
    }
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('blogs/edit', { user: user, 'id': id, 'blog': result, title: 'Edit Blog' });
        })
        .catch((err) => {
            res.render('404', { user: user, title: 'Not Found' })
            console.log(err);
        })
})

const blog_update = ((req, res) => {
    var user = {
        'name': req.cookies["name"],
        'email': req.cookies["email"],
    }
    const id = req.params.id;
    Blog.findById(id)
        .then((blog) => {
            blog.title = req.body.title;
            blog.snippet = req.body.snippet;
            blog.body = req.body.body;
            blog.date = new Date();
            blog.save()
                .then((result) => {
                    res.redirect('/');
                })
                .catch((err) => {
                    res.render('404', { user: user, title: 'Not Found' })
                    console.log(err);
                })
        })
        .catch((err) => {
            res.render('404', { user: user, title: 'Not Found' })
            console.log(err);
        })
})

const blog_delete = ((req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/' });
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = {
    'blog_index': blog_index,
    'blog_details': blog_details,
    'blog_create_get': blog_create_get,
    'blog_create_post': blog_create_post,
    'blog_edit_get': blog_edit_get,
    'blog_update': blog_update,
    'blog_delete': blog_delete,
};