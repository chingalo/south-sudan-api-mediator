import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = (password) => {
  const salt = 10;
  return bcrypt.hashSync(password, salt);
};

const veryfyPassword = async (password, dbPassword) => {
  return bcrypt.compare(password, dbPassword);
};

const generateTokens = (email, fullName, role) => jwt.sign({
  email, fullName, role,
},
process.env.JWT_SCRETE_KEY,
{
  expiresIn: '1hr',
});
export {
  hashPassword, generateTokens, veryfyPassword,
};
