import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

export const prisma = new PrismaClient();

const addUsersToGroup = async (groupId: number, userIds: number[]) => {
  const addUsers = userIds.map((userId) => prisma.userGroup.create({ data: { groupId, userId } }));
  const result = await prisma.$transaction([...addUsers]);

  logger.info(
    `Method addUsersToGroup has been invoked with arguments: groupId=${groupId}, userIds=${userIds}`
  );

  return result;
};

const deleteUserInGroups = async (id: string) => {
  const result = await prisma.userGroup.deleteMany({
    where: { userId: Number(id) },
  });

  logger.info(`Method deleteUserInGroups has been invoked with arguments: id=${id}`);

  return result;
};

const deleteGroupOfUsers = async (id: string) => {
  const result = await prisma.userGroup.deleteMany({
    where: { groupId: Number(id) },
  });

  logger.info(`Method deleteGroupOfUsers has been invoked with arguments: id=${id}`);

  return result;
};

export { addUsersToGroup, deleteUserInGroups, deleteGroupOfUsers };
