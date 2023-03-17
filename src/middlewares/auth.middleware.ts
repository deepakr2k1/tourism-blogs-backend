import { decodeToken } from '../utils/jwt';
import _ from 'lodash';

const auth = async (req: Req, res: Res, next: Next) => {
    try {
        let accessToken = req.cookies && req.cookies.accessToken;
        if (!accessToken) {
            res.status(403).send({ message: 'No Access Token' });
        }
        let decoded = await decodeToken(accessToken);
        req.user = _.pick(decoded, ['id', 'name', 'email']);
        next();
    } catch (err) {
        return res.status(403).send({ err, msg: 'Invalid Access Token' });
    }
};

export default auth;