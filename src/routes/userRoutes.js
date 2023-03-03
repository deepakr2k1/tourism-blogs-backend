const router = require('express').Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.get('/verifyEmail', userController.verifyEmail);
router.post('/login', userController.login);
router.get('/profile', auth, userController.profile);

module.exports = router;