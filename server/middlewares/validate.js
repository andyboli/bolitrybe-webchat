const Boom = require('@hapi/boom');

function validateMiddleware(schema) {
  return async (req, _res, next) => {
    try {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        throw Boom.badRequest('Invalid Data', {
          details: error.details.map(({ message }) => message),
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validateMiddleware;
