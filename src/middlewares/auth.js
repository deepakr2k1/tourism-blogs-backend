const { decodeToken } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const accessExpiration = process.env.ACCESS_TOKEN_EXPIRATION;

const auth = async (req, res, next) => {
    try {
        const accessToken = req.cookies && req.cookies.accessToken;
        if (!accessToken) {
            res.status(403).send({ err, message: 'No Access Token' });
        }
        const decoded = await decodeToken(accessToken);
        req.user = _.pick(decoded, ['id', 'name', 'email']);
        next();
    } catch (err) {
        res.status(403).send({ err, msg: 'Invalid Access Token' });
    }
};

module.exports = auth;