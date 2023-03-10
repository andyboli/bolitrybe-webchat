const express = require('express');

const rescue = require('express-rescue');

const chatController = require('./chatController');

const {
  joiSchemas: {
    chatSchema: { createSchema, listByUsersSchema },
  },
} = require('../../utils');

const router = express.Router();

function chatRouter({ middlewares, ...dependencies }) {
  router
    .route('/')
    .post(
      middlewares.auth,
      middlewares.validate(createSchema),
      rescue(chatController.create(dependencies)),
    );

  router
    .route('/user')
    .post(
      middlewares.auth,
      middlewares.validate(listByUsersSchema),
      rescue(chatController.listByUsers(dependencies)),
    );

  router
    .route('/user/:id')
    .get(middlewares.auth, rescue(chatController.listByUserId(dependencies)));

  router.route('/:id').get(middlewares.auth, rescue(chatController.find(dependencies)));

  return router;
}

module.exports = chatRouter;
