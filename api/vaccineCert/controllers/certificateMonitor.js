import uuidV1 from 'uuid/v1';
import Users from '../models/Users';
import CertificatePrintCount from '../models/CertificatePrintCount';
import {
  generateTokens,
  hashPassword,
  veryfyPassword,
} from '../../commons/utils/auth';
import {
  accessDenied,
  notFound,
  somethingWrongErr,
  success,
} from '../helpers/messages';
import asyncMiddleware from '../middlewares/asyncCalls';

const { DEFAULT_EMAIL, DEFAULT_PASSWORD } = process.env;
// perform monitering certificates printed here
const getPrints = asyncMiddleware(async (req, res) => {
  // get users
  const users = await CertificatePrintCount.getAllPrints();
  if (users.rows.length === 0) return notFound(res);
  return success(res, users.rows);
});

// post prints
const postPrints = asyncMiddleware(async (req, res) => {
  // get users
  const { uniqueId, fullName, occupation, dob, address } = req.data;
  const users = new CertificatePrintCount(
    uniqueId,
    fullName,
    occupation,
    dob,
    address,
    new Date(),
  );
  const storeUsers = await users.storeCertificatePrint();
  if (storeUsers.rows === 0) return somethingWrongErr(res); // data not posted
  return success(res); // don't return data-> success
});

// signin
const login = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;
  const userId = email; // if user entered id instead of email
  // get db password
  const user = await Users.getUsers(email, userId);
  if (user.rows.length === 0) {
    // bug for admin login, create account onfly with default env credentials
    const userDefault = new Users(
      DEFAULT_EMAIL,
      uuidV1(),
      'kose dev',
      hashPassword(DEFAULT_PASSWORD),
      'admin',
      new Date(),
    );
    await userDefault.createAccount(); // create default account
    return accessDenied(res);
  }
  const { full_name: fullName, role, password: dbPassword } = user.rows[0];
  // verify password
  const status = await veryfyPassword(password, dbPassword);
  if (!status) return accessDenied(res);
  // generate access tokens
  const data = {
    token: generateTokens(email, fullName, role),
  };
  return success(res, data);
});

// create user to monitor prints
const signup = asyncMiddleware(async (req, res) => {
  // TODO
  // ensure user has admin token to create a user
});
export { getPrints, postPrints, login };
