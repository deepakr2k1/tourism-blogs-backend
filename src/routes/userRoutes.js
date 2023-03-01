const router = require('express').Router();
const userController = require('../controllers/userController');
const sendVerificationEmail = require('../mails/emailVerification');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/test', async (req, res) => {
    try {
        data = {
            name: 'Deepak Rathore',
            email: 'deepakrathore2k1new@gmail.com',
            code: '650921'
        };
        await sendVerificationEmail(data);
        res.send('EMAIL SENT');
    } catch (err) {
        res.send('ERROR: ' + err.message);
        console.error(err);
    }
});

module.exports = router;