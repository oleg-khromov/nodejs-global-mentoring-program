import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { users, groups } from './data';

async function main() {
  for (let user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  for (let group of groups) {
    await prisma.group.create({
      data: group,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
