const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/create', blogController.createBlog);
router.post('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;