import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const addUsersToGroup = async (groupId: number, userIds: number[]) => {
  const addUsers = userIds.map((userId) => prisma.userGroup.create({ data: { groupId, userId } }));
  const result = await prisma.$transaction([...addUsers]);
  console.log('addUsersToGroup', result);

  return result;
};

const deleteUserInGroups = async (id: string) => {
  const result = await prisma.userGroup.deleteMany({
    where: { userId: Number(id) },
  });

  return result;
};

const deleteGroupOfUsers = async (id: string) => {
  const result = await prisma.userGroup.deleteMany({
    where: { groupId: Number(id) },
  });

  return result;
};

export { addUsersToGroup, deleteUserInGroups, deleteGroupOfUsers };
