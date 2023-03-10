const Joi = require('@hapi/joi');

const title = Joi.string().messages({
  'string.base': 'title must be a type of string',
  'string.empty': 'title is not allowed to be empty',
});

const userId = Joi.string().messages({
  'string.base': 'title must be a type of string',
  'string.empty': 'title is not allowed to be empty',
});

const users = Joi.array().required().items(Joi.string()).min(1)
.messages({
  'array.base': 'users must be a type of array',
  'array.min': 'users must contain at least two users',
  'array.empty': 'users is not allowed to be empty',
});

const isPrivate = Joi.boolean().messages({
  'string.base': 'isPrivate must be a type of boolean',
  'string.empty': 'isPrivate is not allowed to be empty',
});

const createSchema = Joi.object({
  isPrivate,
  title,
  users,
  userId,
}).unknown(false);

const listByUsersSchema = Joi.object({
  users,
});

module.exports = {
  createSchema,
  listByUsersSchema,
};
