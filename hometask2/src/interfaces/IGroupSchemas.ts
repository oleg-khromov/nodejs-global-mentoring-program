import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { Permission } from './IGroup';

export interface GetGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    id: string;
  };
}

export interface DeleteGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: string;
  };
}

export interface CreateGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id?: string;
    name: string;
    permissions: Array<Permission>;
  };
}

export interface UpdateGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: string;
    name: string;
    permissions: Array<Permission>;
  };
}

export interface GetGroupsListRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {};
}

export interface AddUsersToGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    groupId: number;
    userIds: number[];
  };
}
