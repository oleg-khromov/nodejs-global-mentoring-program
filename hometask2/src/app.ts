import express, { Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import routes from './api';
import logger from './utils/logger';

const app = express();
const { port } = config;

app.use(cors());
app.use(express.json());

// app.all('*', (req: Request, res: Response, next) => {
//   logger.info('Incoming request', { method: req.method, query: req.query, body: req.body });

//   return next();
// });

app.use((err: any, req: Request, res: Response, next: any) => {
  const status = err.status || 500;
  res.status(status).json({ status, message: err.message });
  logger.error(`${status}: ${err.message}`);
  return next();
});

app.use('/api', routes());

process.on('uncaughtException', (err) => {
  logger.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ unhandledRejection: { reason, promise } });
  8;
});

process.on('rejectionHandled', (promise) => {
  logger.error({ rejectionHandled: { promise } });
});

app
  .listen(port, () => {
    logger.info(`App listening on port ${port}`);
  })
  .on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });
