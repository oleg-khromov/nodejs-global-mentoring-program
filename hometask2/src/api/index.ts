import { Router } from 'express';
import user from './routes/user';
import group from './routes/group';
import auth from './routes/auth';

export default () => {
  const app = Router();
  user(app);
  group(app);
  auth(app);

  return app;
};
