import { Router, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { ISchemas, IUser } from '../../interfaces';
import * as schema from '../../validate/Schemas';
import {
  findUserById,
  createNewUser,
  findUserByLogin,
  updateUser,
  deleteUser,
  getAutoSuggestUsers,
} from '../../store';

const route = Router();
const validator = createValidator();

export default (app: Router) => {
  app.use('/user', route);

  route.get(
    '/',
    validator.query(schema.schemaGetUser),
    (req: ValidatedRequest<ISchemas.GetUserRequestSchema>, res: Response) => {
      const { id } = req.query;
      const user = findUserById(id);

      if (user.length) {
        res.json({ user }).status(200).end();
      } else {
        res.status(404).end('User not found');
      }
    }
  );

  route.post(
    '/new',
    validator.body(schema.schemaCreateUser),
    (req: ValidatedRequest<ISchemas.CreateUserRequestSchema>, res: Response) => {
      const { login } = req.body;
      const user = findUserByLogin(login);

      if (!user.length) {
        const newUser = createNewUser(req.body);
        res.json({ user: newUser }).status(200).end();
      } else {
        res.status(404).end('User with that login is already exist');
      }
    }
  );

  route.post(
    '/edit',
    validator.body(schema.schemaUpdateUser),
    (req: ValidatedRequest<ISchemas.UpdateUserRequestSchema>, res: Response) => {
      const { id } = req.body;
      const user = findUserById(id);
      let flag = false;

      if (user.length) {
        flag = updateUser(req.body);
      }

      if (flag) {
        res.status(200).end(`User ${id} was updated`);
      } else {
        res.status(404).end('User not found');
      }
    }
  );

  route.get(
    '/list',
    validator.query(schema.schemaGetUsersList),
    (req: ValidatedRequest<ISchemas.GetUsersListRequestSchema>, res: Response) => {
      const { str, limit } = req.query;
      let users: IUser[] = [];

      users = getAutoSuggestUsers(str, limit);

      if (users.length) {
        res.json({ users }).status(200);
      } else {
        res.status(404).end('Not found matches results');
      }
    }
  );

  route.post(
    '/delete',
    validator.body(schema.schemaDeleteUser),
    (req: ValidatedRequest<ISchemas.DeleteUserRequestSchema>, res: Response) => {
      const { id } = req.body;
      const user = findUserById(id);
      let flag = false;

      if (user.length) {
        flag = deleteUser(id);
      }

      if (flag) {
        res.status(200).end(`User ${id} was deleted`);
      } else {
        res.status(404).end('User not found');
      }
    }
  );
};
