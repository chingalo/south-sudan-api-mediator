import JWT from 'jsonwebtoken';
import { accessDenied, forbidden } from '../helpers/messages';

const veryfyTokens = async (req, res, next) => {
  try {
    const header = req.headers['x-auth-token'];
    if (typeof header === 'undefined') return accessDenied(res);
    const bearer = header.split(' ');
    const token = bearer[1];
    req.token = token;
    const data = await JWT.verify(token, process.env.JWT_SCRETE_KEY);
    if (!data) return accessDenied(res);
    req.loggedinData = data;
    const { role } = data;
    const userRole = role.toLowerCase();
    if (userRole === 'admin' || userRole === 'moniters') return next();
    return forbidden(res); // TODO Security risk ie the 'admin' needs to be some hard to guess word/phrase 
  } catch (error) {
    accessDenied(res);
  }
};

export { veryfyTokens };
