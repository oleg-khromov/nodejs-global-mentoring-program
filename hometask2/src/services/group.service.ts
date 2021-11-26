import { PrismaClient } from '@prisma/client';
import { IGroup, IGroupCreateInput } from '../interfaces';
import { deleteGroupOfUsers } from './usergroup.service';

export const prisma = new PrismaClient();

const findGroupById = async (id: string) => {
  const group = await prisma.group.findUnique({
    where: { id: Number(id) },
  });

  if (!group) {
    throw Error('Group not found');
  }

  return group;
};

const findGroupByName = async (name: string) =>
  await prisma.group.findUnique({
    where: { name },
  });

const createGroup = async (data: IGroupCreateInput) => {
  const { name } = data;
  const group = await findGroupByName(name);

  if (group) {
    throw Error('Group with that name is already exist');
  }

  const newGroup = await prisma.group.create({ data });

  return newGroup;
};

const updateGroup = async ({ id, ...data }: IGroup) => {
  const group = await findGroupById(String(id));

  if (!group) {
    throw Error('Group not found');
  }

  const updatedGroup = await prisma.group.update({
    where: { id: Number(id) },
    data,
  });

  return updatedGroup;
};

const deleteGroup = async (id: string) => {
  const group = await findGroupById(id);

  if (!group) {
    throw Error('Group not found');
  }

  const deletedGroup = await prisma.group.delete({
    where: { id: Number(id) },
  });

  await deleteGroupOfUsers(id);

  return deletedGroup;
};

const getAllGroups = async () => {
  const groups = await prisma.group.findMany();

  return groups;
};

export { findGroupById, createGroup, updateGroup, deleteGroup, getAllGroups };
