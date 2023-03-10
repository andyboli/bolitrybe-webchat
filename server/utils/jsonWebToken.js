require('dotenv').config();

const jwt = require('jsonwebtoken');

const jwtConfig = {
  expiresIn: '3h',
  algorithm: 'HS256',
};

const signToken = (data) => jwt.sign({ data }, process.env.JWT_SECRET, jwtConfig);

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  signToken,
  verifyToken,
};
