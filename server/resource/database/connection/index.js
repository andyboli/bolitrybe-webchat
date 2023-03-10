const Boom = require('@hapi/boom');

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error) => {
    throw Boom.badImplementation(error.message);
  });

module.exports = mongoose;
