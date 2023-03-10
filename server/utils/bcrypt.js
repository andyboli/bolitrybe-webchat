const bcrypt = require('bcrypt');

const checkString = async ({ string, hash }) => bcrypt.compare(string, hash);

const createHash = async (string) => {
  const saltRounds = 10;
  return bcrypt.hash(string, saltRounds);
};

module.exports = {
  checkString,
  createHash,
};
