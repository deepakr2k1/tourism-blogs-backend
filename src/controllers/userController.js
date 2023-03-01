const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { signToken } = require('../helpers/jwt');
const cookieExpiration = process.env.COOKIE_EXPIRATION;
const HASH_SALT = 10;
const INTERNAL_SERVER_ERROR = {
    error: 'INTERNAL_SERVER_ERROR',
    message: 'OOPS! Something went wrong!'
};

const register = (async (req, res) => {
    try {
        const user = new UserModel(req.body);
        user.email = user.email.toLowerCase();
        console.log(user);
        const isEmailRegistered = await UserModel.exists({ email: user.email });
        if (isEmailRegistered) {
            return res.status(400).send({ message: 'Email already registered' });
        }
        user.password = await bcrypt.hash(user.password, HASH_SALT);
        // todo: email verification
        await UserModel.create(user);

        const _user = _.pick(user, ['id', 'name', 'email']);
        const accessToken = await signToken(_user);
        res.cookie('accessToken', accessToken, { maxAge: cookieExpiration, httpOnly: true });
        res.status(201).send({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

const login = (async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            res.status(400).send({ message: 'User not found' });
        }
        if (!await bcrypt.compare(password, user.password)) {
            res.status(400).send({ message: 'Wrong password' });
        }
        const _user = _.pick(user, ['id', 'name', 'email']);
        const accessToken = await signToken(_user);
        res.cookie('accessToken', accessToken, { maxAge: cookieExpiration, httpOnly: true });
        res.status(202).send({ message: 'Logged in Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send(INTERNAL_SERVER_ERROR);
    }
});

module.exports = {
    register,
    login,
};