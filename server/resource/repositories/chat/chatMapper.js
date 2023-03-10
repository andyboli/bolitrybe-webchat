const models = require('../../database');

const ChatRepository = require('./chatRepository');

function chatMapper(data) {
  return new ChatRepository({
    models,
    data,
  });
}

module.exports = chatMapper;
