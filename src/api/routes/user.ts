import { Router, Response } from 'express';
import Joi from 'joi';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator,
} from 'express-joi-validation';
import 'joi-extract-type';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../interfaces/IUser';

const route = Router();
const validator = createValidator({});

const schemaGetUser = Joi.object({
  id: Joi.string().required(),
});

const schemaDeleteUser = Joi.object({
  id: Joi.string().required(),
});

const schemaCreateUser = Joi.object({
  id: Joi.string(),
  login: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]$')).required(),
  age: Joi.number().integer().min(4).max(130).required(),
  isDeleted: Joi.boolean(),
});

const schemaUpdateUser = Joi.object({
  id: Joi.string().required(),
  login: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]$')).required(),
  age: Joi.number().integer().min(4).max(130).required(),
  isDeleted: Joi.boolean(),
});

const schemaGetUsersList = Joi.object({
  str: Joi.string().required(),
  limit: Joi.number().integer().required(),
});

interface GetUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    id: string;
  };
}

interface DeleteUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: string;
  };
}

interface CreateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Joi.extractType<typeof schemaCreateUser>;
  // [ContainerTypes.Body]: {
  //   id?: string;
  //   login: string;
  //   password: string;
  //   age: number;
  //   isDeleted?: boolean;
  // };
}

interface UpdateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted?: boolean;
  };
}

interface GetUsersListRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    str: string;
    limit: number;
  };
}

let users: IUser[] = [];

export default (app: Router) => {
  app.use('/user', route);

  route.get(
    '/',
    validator.query(schemaGetUser),
    (req: ValidatedRequest<GetUserRequestSchema>, res: Response) => {
      const { id } = req.query;
      const user = users.filter((user) => user.id === id);

      if (user.length) {
        res.json({ user }).status(200).end();
      } else {
        res.status(404).end('User not found');
      }
    }
  );

  route.post(
    '/new',
    validator.query(schemaCreateUser),
    (req: ValidatedRequest<CreateUserRequestSchema>, res: Response) => {
      const { login, password, age } = req.body;

      const newUser = {
        id: uuidv4(),
        login,
        password,
        age,
        isDeleted: false,
      };

      users.push(newUser);
      console.log(users);

      res.json({ user: newUser }).status(200).end();
    }
  );

  route.post(
    '/edit',
    validator.query(schemaUpdateUser),
    (req: ValidatedRequest<UpdateUserRequestSchema>, res: Response) => {
      const { id } = req.body;
      let flag = false;

      const updatedUsers = users.map((user) => {
        if (user.id === id) {
          flag = true;

          return {
            ...user,
            ...req.body,
          };
        }

        return user;
      });

      users = updatedUsers;
      console.log(users);

      if (flag) {
        res.status(200).end(`User ${id} was updated`);
      } else {
        res.status(404).end('User not found');
      }
    }
  );

  route.get(
    '/list',
    validator.query(schemaGetUsersList),
    (req: ValidatedRequest<GetUsersListRequestSchema>, res: Response) => {
      const { str: loginSubsting, limit: limitUsers } = req.query;
      let result = [];
      let count = 0;

      const getAutoSuggestUsers = (str: string, limit: number) => {
        const search = users
          .sort((u1, u2) => (u1.login > u2.login ? 1 : -1))
          .filter((user) => {
            if (count < limit) {
              console.log(user.login.toLowerCase().includes(str.toLowerCase()));

              if (user.login.toLowerCase().includes(str.toLowerCase()) && !user.isDeleted) {
                count += 1;
                console.log(count);
                return user;
              }
            }
          });

        return search;
      };

      result = getAutoSuggestUsers(String(loginSubsting), Number(limitUsers));
      console.log(result);

      if (result.length) {
        res.json({ users: result }).status(200);
      } else {
        res.status(404).end('Not found matches results');
      }
    }
  );

  route.post(
    '/delete',
    validator.query(schemaDeleteUser),
    (req: ValidatedRequest<DeleteUserRequestSchema>, res: Response) => {
      const { id } = req.body;

      let flag = false;
      const updatedUsers = users.map((user) => {
        if (user.id === id) {
          flag = true;

          return {
            ...user,
            isDeleted: true,
          };
        }

        return user;
      });

      users = updatedUsers;
      console.log(users);

      if (flag) {
        res.status(200).end(`User ${id} was deleted`);
      } else {
        res.status(404).end('User not found');
      }
    }
  );
};
