const models = require('../../database');

const UserRepository = require('./userRepository');

function userMapper(data) {
  return new UserRepository({
    models,
    data,
  });
}

module.exports = userMapper;
