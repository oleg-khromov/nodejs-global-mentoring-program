import { Router } from 'express';
import user from './routes/user';
import group from './routes/group';

export default () => {
  const app = Router();
  user(app);
  group(app);

  return app;
};
