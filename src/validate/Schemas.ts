import Joi from 'joi';

export const schemaGetUser = Joi.object({
  id: Joi.string().required(),
});

export const schemaDeleteUser = Joi.object({
  id: Joi.string().required(),
});

export const schemaCreateUser = Joi.object({
  id: Joi.string(),
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]*$'))
    .message('Password must contains only letters and numbers')
    .required(),
  age: Joi.number()
    .integer()
    .min(4)
    .message('Age must be min 4')
    .max(130)
    .message('Age must be max 130')
    .required(),
  isDeleted: Joi.boolean(),
});

export const schemaUpdateUser = Joi.object({
  id: Joi.string().required(),
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]*$'))
    .message('Password must contains only letters and numbers')
    .required(),
  age: Joi.number()
    .integer()
    .min(4)
    .message('Age must be min 4')
    .max(130)
    .message('Age must be max 130')
    .required(),
  isDeleted: Joi.boolean(),
});

export const schemaGetUsersList = Joi.object({
  str: Joi.string().required(),
  limit: Joi.number().integer().required(),
});
