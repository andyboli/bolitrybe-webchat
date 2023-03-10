const mongoose = require('../connection');

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    createdAt: { type: Date, default: new Date() },
    content: String,
    userId: String,
  },
  { versionKey: false },
);

module.exports = mongoose.model('message', messageSchema);
