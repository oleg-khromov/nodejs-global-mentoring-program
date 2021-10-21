import express from 'express';
import config from './config';
import routes from './api';

const app = express();
const { port } = config;

app.use(express.json());

app.use('/api', routes());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
