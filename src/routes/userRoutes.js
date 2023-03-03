const router = require('express').Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/verifyEmail', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/profile', auth, userController.profile);

module.exports = router;