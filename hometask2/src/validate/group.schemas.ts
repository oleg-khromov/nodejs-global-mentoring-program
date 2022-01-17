import Joi from 'joi';

export const schemaGetGroup = Joi.object({
  id: Joi.number().required(),
});

export const schemaDeleteGroup = Joi.object({
  id: Joi.number().required(),
});

export const schemaCreateGroup = Joi.object({
  id: Joi.number(),
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'))
    .required(),
});

export const schemaUpdateGroup = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  permissions: Joi.array()
    .items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'))
    .required(),
});

export const schemaGetGroupsList = Joi.object({});

export const schemaAddUsersToGroup = Joi.object({
  groupId: Joi.number().required(),
  userIds: Joi.array().items(Joi.number()).required(),
});
