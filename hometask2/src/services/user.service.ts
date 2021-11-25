import { PrismaClient } from '@prisma/client';
import { IUser, IUserCreateInput } from '../interfaces';

export const prisma = new PrismaClient();

const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw Error('User not found');
  }

  return user;
};

const findUserByLogin = async (login: string) =>
  await prisma.user.findUnique({
    where: { login },
  });

const createUser = async (data: IUserCreateInput) => {
  const { login } = data;
  const user = await findUserByLogin(login);

  if (user) {
    throw Error('User with that login is already exist');
  }

  const newUser = await prisma.user.create({ data });

  return newUser;
};

const updateUser = async ({ id, ...data }: IUser) => {
  const user = await findUserById(String(id));

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

  if (!user) {
    throw Error('User not found');
  }

  const deletedUser = await prisma.user.delete({
    where: { id: Number(id) },
  });

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

  return limit ? users.slice(0, limit) : users;
};

export { findUserById, createUser, updateUser, deleteUser, getAutoSuggestUsers };
