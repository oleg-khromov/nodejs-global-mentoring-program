import { Router, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { ISchemas } from '../../interfaces';
import * as schema from '../../validate/Schemas';
import {
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  getAutoSuggestUsers,
} from '../../services/user.service';

const route = Router();
const validator = createValidator();

export default (app: Router) => {
  app.use('/users', route);

  route.get(
    '/:id',
    validator.body(schema.schemaGetUser),
    async (req: ValidatedRequest<ISchemas.GetUserRequestSchema>, res: Response) => {
      const { id } = req.body;

      try {
        const user = await findUserById(id);
        res.status(200).json({ status: 200, data: user });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
      }
    }
  );

  route.post(
    '/',
    validator.body(schema.schemaCreateUser),
    async (req: ValidatedRequest<ISchemas.CreateUserRequestSchema>, res: Response) => {
      try {
        const user = await createUser(req.body);
        res.status(200).json({ status: 200, data: user });
      } catch (error: any) {
        res.status(404).json({ status: 400, message: error.message });
      }
    }
  );

  route.put(
    '/:id',
    validator.body(schema.schemaUpdateUser),
    async (req: ValidatedRequest<ISchemas.UpdateUserRequestSchema>, res: Response) => {
      try {
        const user = await updateUser(req.body);
        res.status(200).json({ status: 200, data: user, message: `User ${user.id} was updated` });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
      }
    }
  );

  route.get(
    '/',
    validator.body(schema.schemaGetUsersList),
    async (req: ValidatedRequest<ISchemas.GetUsersListRequestSchema>, res: Response) => {
      const { str, limit } = req.body;

      try {
        const users = await getAutoSuggestUsers(str, limit);
        res.status(200).json({ status: 200, data: users });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
      }
    }
  );

  route.delete(
    '/:id',
    validator.body(schema.schemaDeleteUser),
    async (req: ValidatedRequest<ISchemas.DeleteUserRequestSchema>, res: Response) => {
      const { id } = req.body;

      try {
        const user = await deleteUser(id);
        res.status(200).json({ status: 200, data: user.id, message: `User ${id} was deleted` });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
      }
    }
  );
};
