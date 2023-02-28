const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');

router.get('/getAllBlogs', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.blog_create_post);
router.get('/create', blogController.blog_create_get);
// router.get('/:id/edit', blogController.blog_edit_get);
router.post('/:id', blogController.blog_update);
router.delete('/:id', blogController.blog_delete);

module.exports = router;