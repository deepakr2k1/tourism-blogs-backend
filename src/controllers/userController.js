const bcrypt = require('bcrypt');
const _ = require('lodash');
const { signToken, decodeToken } = require('../utils/jwt');
const UserModel = require('../models/user');
const OtpModel = require('../models/otp');
const emailVerification = require('../mails/emailVerification');

const cookieExpiration = process.env.COOKIE_EXPIRATION;
const { HASH_SALT } = require('../../config');
const { SEND_CODE_MIN, SEND_CODE_MAX } = require('../utils/constants');
const { INTERNAL_SERVER_ERROR } = require('../utils/statusCodeResponses');

const getRandomNumber = () => {
    return Math.floor(Math.random() * (SEND_CODE_MAX - SEND_CODE_MIN + 1)) + SEND_CODE_MIN;
};

const sendEmailVerificationCode = async ({ name, email }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let code = getRandomNumber();
            let otp = new OtpModel({ email, code });
            if (await OtpModel.exists({ email })) {
                await OtpModel.updateOne({ email: otp.email }, { code: code });
            } else {
                await OtpModel.create(otp);
            }
            emailVerification({ name, email, code });
            resolve(code);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

const register = (async (req, res) => {
    try {
        let user = new UserModel(req.body);
        user.email = user.email.toLowerCase();
        let _user = await UserModel.findOne({ email: user.email });
        if (_user == null) {
            user.password = await bcrypt.hash(user.password, HASH_SALT);
            await UserModel.create(user);
        } else if (_user.status == 'UNVERIFIED') {
            user.password = await bcrypt.hash(user.password, HASH_SALT);
            await UserModel.updateOne({ id: _user.id }, user);
        } else {
            return res.status(400).send({ message: 'Email already registered' });
        }
        await sendEmailVerificationCode(user);
        res.status(200).send({ message: 'Email Verification Code sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const verifyEmail = (async (req, res) => {
    try {
        let { email, code } = req.body;
        email = email.toLowerCase();
        code = parseInt(code);
        let otp = await OtpModel.findOne({ email: email });
        if (otp == null) {
            return res.status(400).send({ message: 'OTP not found' });
        } else if (otp.code != code) {
            return res.status(400).send({ message: 'Incorrect OTP' });
        }
        let user = await UserModel.updateOne({ email: otp.email }, { status: 'VERIFIED' });
        await OtpModel.deleteOne({ email: otp.email });

        user = await UserModel.findOne({ email: otp.email });
        user = _.pick(user, ['id', 'name', 'email']);
        let accessToken = await signToken(user);
        res.cookie('accessToken', accessToken, { maxAge: cookieExpiration, httpOnly: true });
        res.status(202).send({ message: 'Account setup completed' });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const login = (async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: 'Wrong password' });
        }
        let _user = _.pick(user, ['id', 'name', 'email']);
        let accessToken = await signToken(_user);
        res.cookie('accessToken', accessToken, { maxAge: cookieExpiration, httpOnly: true });
        res.status(202).send({ user: _user });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const logout = (async (req, res) => {
    try {
        res.clearCookie('accessToken').send({});
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const profile = (async (req, res) => {
    try {
        let accessToken = req.cookies && req.cookies.accessToken;
        if (!accessToken && typeof (accessToken) == 'undefined') {
            res.status(403).send({ err, message: 'No Access Token' });
        }
        let decoded = await decodeToken(accessToken);
        user = _.pick(decoded, ['id', 'name', 'email']);
        res.cookie('accessToken', accessToken, { maxAge: cookieExpiration, httpOnly: true });
        res.status(202).send({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

module.exports = {
    register,
    verifyEmail,
    login,
    profile,
    logout
};