const router = require('express').Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/create', blogController.createBlog);
router.post('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;