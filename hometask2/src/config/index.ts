import dotenv from 'dotenv';

const config = dotenv.config();

if (config.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || '',
};
