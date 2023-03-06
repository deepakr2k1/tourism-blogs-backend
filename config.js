module.exports = {
    CORS_ORIGIN_URLS: [
        `http://localhost:3000`
    ],
    COOKIE_OPTIONS: {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
    },
    HASH_SALT: 10,
    ACCESS_TOKEN_EXPIRATION: 604800000,
    COOKIE_EXPIRATION: 604800000,
    MAX_SNIPPET_LENGTH: 100,
};