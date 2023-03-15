import jwt from 'jsonwebtoken';
const accessSecretKey: string = process.env.ACCESS_SECRET_KEY;
const accessExpiration: number = process.env.ACCESS_TOKEN_EXPIRATION;

export const signToken = (payload: any) => {
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

export const decodeToken = (token: any) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, accessSecretKey);
            resolve(decoded);
        } catch (err) {
            reject(err);
        }
    });
};
