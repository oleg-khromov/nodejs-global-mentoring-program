import { PrismaClient } from '@prisma/client';
import { IUser, IUserCreateInput } from '../interfaces';
import { deleteUserInGroups } from './usergroup.service';
import logger from '../utils/logger';

export const prisma = new PrismaClient();

const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  logger.info(`Method findUserById has been invoked with arguments: id=${id}`);

  if (!user) {
    throw Error('User not found');
  }

  return user;
};

const findUserByLogin = async (login: string) => {
  const user = await prisma.user.findUnique({
    where: { login },
  });

  logger.info(`Method findUserByLogin has been invoked with arguments: login=${login}`);

  return user;
};

const createUser = async (data: IUserCreateInput) => {
  const { login, password, age } = data;
  const user = await findUserByLogin(login);

  logger.info(
    `Method createUser has been invoked with arguments: login=${login}, password=${password}, age=${age}`
  );

  if (user) {
    throw Error('User with that login is already exist');
  }

  const newUser = await prisma.user.create({ data });

  return newUser;
};

const updateUser = async ({ id, ...data }: IUser) => {
  const user = await findUserById(String(id));
  const { login, password, age } = data;

  logger.info(
    `Method updateUser has been invoked with arguments: id=${id}, login=${login}, password=${password}, age=${age}`
  );

  if (!user) {
    throw Error('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await findUserById(id);

  logger.info(`Method deleteUser has been invoked with arguments: id=${id}`);

  if (!user) {
    throw Error('User not found');
  }

  const deletedUser = await prisma.user.delete({
    where: { id: Number(id) },
  });

  await deleteUserInGroups(id);

  return deletedUser;
};

const getAutoSuggestUsers = async (str: string, limit: number) => {
  const users = await prisma.user.findMany({
    where: {
      login: {
        contains: str,
        mode: 'insensitive',
      },
      isDeleted: false,
    },
  });

  logger.info(
    `Method getAutoSuggestUsers has been invoked with arguments: id=${str}, limit=${limit}`
  );

  return limit ? users.slice(0, limit) : users;
};

export { findUserById, createUser, updateUser, deleteUser, getAutoSuggestUsers };
