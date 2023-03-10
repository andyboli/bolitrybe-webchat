const chatMapper = require('./chat/chatMapper');
const messageMapper = require('./message/messageMapper');
const userMapper = require('./user/userMapper');

module.exports = {
  chatModel: chatMapper,
  messageModel: messageMapper,
  userModel: userMapper,
};
