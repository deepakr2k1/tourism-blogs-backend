import bcrypt from 'bcrypt';
import * as _ from 'lodash';
import UserModel from '../models/user.model';
import OtpModel from '../models/otp.model';
import { signToken, decodeToken } from '../utils/jwt';
import { publishSendEmailVerificationJob } from '../publishJob';
import { HASH_SALT, COOKIE_EXPIRATION, OTP_AGE } from '../config';
import { SEND_CODE_MIN, SEND_CODE_MAX } from '../utils/constants';
import { INTERNAL_SERVER_ERROR } from '../utils/statusCodeResponses';

const getRandomNumber = (): number => {
    return Math.floor(Math.random() * (SEND_CODE_MAX - SEND_CODE_MIN + 1)) + SEND_CODE_MIN;
};

const sendEmailVerificationCode = async (name: string, email: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            let code = getRandomNumber();
            let otp = new OtpModel({ email, code });
            if (await OtpModel.exists({ email })) {
                await OtpModel.updateOne({ email: otp.email }, { code: code.toString() });
            } else {
                await OtpModel.create(otp);
            }
            publishSendEmailVerificationJob(name, email, code);
            resolve(code);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

export const register = (async (req: Req, res: Res): Promise<Res> => {
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
            return res.status(400).json({ message: 'Email already registered' });
        }
        await sendEmailVerificationCode(user.name, user.email);
        return res.status(200).json({ message: 'Email Verification Code sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
});

export const verifyEmail = (async (req: Req, res: Res): Promise<Res> => {
    try {
        let email: string = req.query.email as string;
        let code: number = parseInt(req.query.code as string);
        email = email.toLowerCase();
        let otp = await OtpModel.findOne({ email, updatedAt: { $gte: new Date(Date.now() - OTP_AGE)} });
        if (otp == null) {
            return res.status(400).json({ message: 'OTP is either expired or not generated' });
        } else if (otp.code != code) {
            return res.status(400).json({ message: 'Incorrect OTP' });
        }
        let user = await UserModel.updateOne({ email: otp.email }, { status: 'VERIFIED' });
        await OtpModel.deleteOne({ email: otp.email });

        user = await UserModel.findOne({ email: otp.email });
        user = _.pick(user, ['id', 'name', 'email']);
        let accessToken = await signToken(user);
        res.cookie('accessToken', accessToken, { maxAge: COOKIE_EXPIRATION, httpOnly: true });
        return res.status(202).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
});

export const login = (async (req: Req, res: Res): Promise<Res> => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Wrong password' });
        }
        let _user = _.pick(user, ['id', 'name', 'email']);
        let accessToken = await signToken(_user);
        res.cookie('accessToken', accessToken, { maxAge: COOKIE_EXPIRATION, httpOnly: true });
        return res.status(202).json({ user: _user });
    } catch (err) {
        console.error(err);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
});

export const logout = (async (req: Req, res: Res): Promise<Res> => {
    try {
        return res.clearCookie('accessToken').json({});
    } catch (err) {
        console.error(err);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
});

export const profile = (async (req: Req, res: Res): Promise<Res> => {
    try {
        let accessToken = req.cookies && req.cookies.accessToken;
        if (!accessToken && typeof (accessToken) == 'undefined') {
            res.status(403).json({ message: 'No Access Token' });
        }
        let decoded = await decodeToken(accessToken);
        let user = _.pick(decoded, ['id', 'name', 'email']);
        return res.status(202).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
});