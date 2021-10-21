import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export interface GetUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    id: string;
  };
}

export interface DeleteUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: string;
  };
}

export interface CreateUserRequestSchema extends ValidatedRequestSchema {
  // [ContainerTypes.Body]: Joi.extractType<typeof schemaCreateUser>;
  [ContainerTypes.Body]: {
    id?: string;
    login: string;
    password: string;
    age: number;
    isDeleted?: boolean;
  };
}

export interface UpdateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted?: boolean;
  };
}

export interface GetUsersListRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    str: string;
    limit: number;
  };
}
