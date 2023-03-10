const Joi = require('@hapi/joi');

const chatId = Joi.string().required().messages({
  'string.base': 'chatId must be a type of string',
  'string.empty': 'chatId is not allowed to be empty',
});

const content = Joi.string().required().messages({
  'string.base': 'content must be a type of string',
  'string.empty': 'content is not allowed to be empty',
});

const createSchema = Joi.object({
  chatId,
  content,
}).unknown(false);

module.exports = {
  createSchema,
};
