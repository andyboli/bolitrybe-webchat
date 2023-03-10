import ReactJoiValidations from 'react-joi-validation';

import Joi from '@hapi/joi';

ReactJoiValidations.setJoi(Joi);

const email = Joi.string()
  .regex(/\S+@\S+\.\S+/)
  .messages({
    'string.pattern.base': 'Email must be in a format <name>@<domain>',
    'string.empty': 'Email is not allowed to be empty',
  });

const nickname = Joi.string()
  .regex(/^[a-zA-Z0-9_][a-zA-Z0-9_.]*/)
  .messages({
    'string.pattern.base': 'Nickname in a wrong format',
    'string.empty': 'Nickname is not allowed to be empty',
  });

const password = Joi.string()
  .pattern(/^.*(.*\d){6,}/)
  .messages({
    'string.empty': 'Password is not allowed to be empty',
    'string.pattern.base': 'Password must contain at least 6 numbers',
  });

const schemas = {
  email,
  nickname,
  password,
};

function validate({ field, value }) {
  const { error } = schemas[field].validate(value);

  return error;
}

function handleField({ callback, field, value }) {
  const error = validate({ field, value });

  if (!error) {
    callback({ value, error: null });
  } else {
    callback({ value, error: error.message });
  }
}

export default handleField;
