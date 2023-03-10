const express = require('express');

const rescue = require('express-rescue');

const messageController = require('./messageController');

const {
  joiSchemas: {
    messageSchema: { createSchema },
  },
} = require('../../utils');

const router = express.Router();

function messageRouter({ middlewares, ...dependencies }) {
  router
    .route('/')
    .get(middlewares.auth, rescue(messageController.listBy(dependencies)))
    .post(
      middlewares.auth,
      middlewares.validate(createSchema),
      rescue(messageController.create(dependencies)),
    );

  return router;
}

module.exports = messageRouter;
