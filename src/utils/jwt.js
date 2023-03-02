const jwt = require('jsonwebtoken');
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const accessExpiration = process.env.ACCESS_TOKEN_EXPIRATION;

const signToken = (payload) => {
    return new Promise((resolve, reject) => {
        try {
            var token = jwt.sign(payload, accessSecretKey, {
                expiresIn: accessExpiration
            });
            resolve(token);
        } catch (err) {
            reject(err);
        }
    });
};

const decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, accessSecretKey);
            resolve(decoded);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    signToken,
    decodeToken
};