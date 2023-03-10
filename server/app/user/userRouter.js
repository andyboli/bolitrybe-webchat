const express = require('express');

const rescue = require('express-rescue');

const userController = require('./userController');

const {
  joiSchemas: {
    userSchema: { loginSchema, registerSchema, updateSchema },
  },
} = require('../../utils');

const router = express.Router();

function userRouter({ middlewares, ...dependencies }) {
  router
    .route('/')
    .get(middlewares.auth, rescue(userController.list(dependencies)))
    .post(middlewares.validate(registerSchema), rescue(userController.create(dependencies)));

  router
    .route('/login')
    .post(middlewares.validate(loginSchema), rescue(userController.login(dependencies)));

  router.route('/token').get(middlewares.auth, rescue(userController.validateToken));

  router
    .route('/:id/image')
    .patch(
      middlewares.auth,
      middlewares.upload({ dest: 'images', field: 'image' }),
      rescue(userController.update(dependencies)),
    );

  router
    .route('/:id')
    .get(middlewares.auth, rescue(userController.find(dependencies)))
    .patch(
      middlewares.auth,
      middlewares.validate(updateSchema),
      rescue(userController.update(dependencies)),
    )
    .delete(middlewares.auth, rescue(userController.remove(dependencies)));

  return router;
}

module.exports = userRouter;
