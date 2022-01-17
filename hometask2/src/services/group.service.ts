import { PrismaClient } from '@prisma/client';
import { IGroup, IGroupCreateInput } from '../interfaces';
import { deleteGroupOfUsers } from './usergroup.service';
import logger from '../utils/logger';

export const prisma = new PrismaClient();

const findGroupById = async (id: string) => {
  const group = await prisma.group.findUnique({
    where: { id: Number(id) },
  });

  logger.info(`Method findGroupById has been invoked with arguments: id=${id}`);

  if (!group) {
    throw Error('Group not found');
  }

  return group;
};

const findGroupByName = async (name: string) => {
  const group = await prisma.group.findUnique({
    where: { name },
  });

  logger.info(`Method findGroupByName has been invoked with arguments: name=${name}`);

  return group;
};

const createGroup = async (data: IGroupCreateInput) => {
  const { name, permissions } = data;
  const group = await findGroupByName(name);

  logger.info(
    `Method createGroup has been invoked with arguments: name=${name}, permissions=${permissions}`
  );

  if (group) {
    throw Error('Group with that name is already exist');
  }

  const newGroup = await prisma.group.create({ data });

  return newGroup;
};

const updateGroup = async ({ id, ...data }: IGroup) => {
  const group = await findGroupById(String(id));
  const { name, permissions } = data;

  logger.info(
    `Method updateGroup has been invoked with arguments: id=${id}, name=${name}, permissions=${permissions}`
  );

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

  logger.info(`Method deleteGroup has been invoked with arguments: id=${id}`);

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

  logger.info(`Method getAllGroups has been invoked. This method doens't have any arguments`);

  return groups;
};

export { findGroupById, createGroup, updateGroup, deleteGroup, getAllGroups };
