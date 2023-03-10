const models = require('../../database');

const MessageRepository = require('./messageRepository');

function messageMapper(data) {
  return new MessageRepository({
    models,
    data,
  });
}

module.exports = messageMapper;
