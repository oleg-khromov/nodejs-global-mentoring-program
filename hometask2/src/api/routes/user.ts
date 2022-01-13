import { Router, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { IUserSchemas } from '../../interfaces';
import * as schema from '../../validate/user.schemas';
import {
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  getAutoSuggestUsers,
} from '../../services/user.service';
import { checkToken } from '../../services/auth.service';
import logger from '../../utils/logger';

const route = Router();
const validator = createValidator();

export default (app: Router) => {
  app.use('/users', route);

  route.get(
    '/:id',
    checkToken,
    validator.body(schema.schemaGetUser),
    async (req: ValidatedRequest<IUserSchemas.GetUserRequestSchema>, res: Response, next) => {
      const { id } = req.body;

      try {
        const user = await findUserById(id);
        res.status(200).json({ status: 200, data: user });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(`method: GET, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`);
      }
    }
  );

  route.post(
    '/',
    checkToken,
    validator.body(schema.schemaCreateUser),
    async (req: ValidatedRequest<IUserSchemas.CreateUserRequestSchema>, res: Response) => {
      try {
        const user = await createUser(req.body);
        res.status(200).json({ status: 200, data: user });
      } catch (error: any) {
        res.status(404).json({ status: 400, message: error.message });
        logger.error(
          `method: POST, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`
        );
      }
    }
  );

  route.put(
    '/:id',
    checkToken,
    validator.body(schema.schemaUpdateUser),
    async (req: ValidatedRequest<IUserSchemas.UpdateUserRequestSchema>, res: Response) => {
      try {
        const user = await updateUser(req.body);
        res.status(200).json({ status: 200, data: user, message: `User ${user.id} was updated` });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(`method: PUT, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`);
      }
    }
  );

  route.get(
    '/',
    checkToken,
    validator.body(schema.schemaGetUsersList),
    async (req: ValidatedRequest<IUserSchemas.GetUsersListRequestSchema>, res: Response) => {
      const { str, limit } = req.body;

      try {
        const users = await getAutoSuggestUsers(str, limit);
        res.status(200).json({ status: 200, data: users });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(`method: GET, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`);
      }
    }
  );

  route.delete(
    '/:id',
    checkToken,
    validator.body(schema.schemaDeleteUser),
    async (req: ValidatedRequest<IUserSchemas.DeleteUserRequestSchema>, res: Response) => {
      const { id } = req.body;

      try {
        const user = await deleteUser(id);
        res.status(200).json({ status: 200, data: user.id, message: `User ${id} was deleted` });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(
          `method: DELETE, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`
        );
      }
    }
  );
};
