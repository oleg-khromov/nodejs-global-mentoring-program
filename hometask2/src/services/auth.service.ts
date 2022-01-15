import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';
import config from '../config';

export const prisma = new PrismaClient();
const { secret } = config;

const findUserByLogin = async (login: string, password: string) => {
  const user = await prisma.user.findMany({
    where: { login, password },
  });

  logger.info(
    `Method findUserByLogin has been invoked with arguments: login=${login}, password=${password}`
  );

  return user[0];
};

const createToken = async (login: string, password: string) => {
  const user = await findUserByLogin(login, password);

  logger.info(`Method createToken has been invoked`);

  if (!user) {
    throw Error('User not found');
  }

  const payload = { id: user.id, login: user.login };
  const token = jwt.sign(payload, secret, { expiresIn: 60000 });

  return {
    user: payload,
    token,
  };
};

const checkToken = async (req: Request, res: Response, next: any) => {
  let token;

  logger.info(`Method checkToken has been invoked`);

  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.error(`Unauthorized Error`);
    return res.status(401).json({ status: 401, message: 'Unauthorized Error' });
  }

  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      logger.error(`Forbidden Error`);
      return res.status(403).json({ status: 403, message: 'Forbidden Error' });
    }

    return next();
  });
};

export { createToken, checkToken };
