const mongoose = require('../connection');

const userSchema = new mongoose.Schema(
  {
    email: String,
    image: String,
    isOnline: Boolean,
    nickname: String,
    password: String,
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
