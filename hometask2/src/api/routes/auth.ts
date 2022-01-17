import { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { IUserSchemas } from '../../interfaces';
import * as schema from '../../validate/user.schemas';
import { createToken } from '../../services/auth.service';
import logger from '../../utils/logger';

const route = Router();
const validator = createValidator();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signin',
    validator.body(schema.schemaGetUserByName),
    async (req: ValidatedRequest<IUserSchemas.GetUserByNameRequestSchema>, res: Response) => {
      try {
        const { login, password } = req.body;
        const { user, token } = await createToken(login, password);
        res.status(200).json({ status: 200, data: { user, token } });
      } catch (error: any) {
        res.status(404).json({ status: 400, message: error.message });
        logger.error(
          `method: POST, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`
        );
      }
    }
  );
};
