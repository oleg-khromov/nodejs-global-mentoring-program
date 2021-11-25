import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const users = [
  {
    login: "Stepan",
    password: "password",
    age: 25
  },
  {
    login: "Ivan",
    password: "password",
    age: 30
  },
  {
    login: "Oleg",
    password: "password",
    age: 35
  },
  {
    login: "Roman",
    password: "password",
    age: 30
  },
  {
    login: "Timur",
    password: "password",
    age: 35
  },
  {
    login: "Sergey",
    password: "password",
    age: 40
  },
  {
    login: "Kirill",
    password: "password",
    age: 30
  }
];

async function main() {
  for (let user of users) {
    await prisma.user.create({
      data: user
    })
  };
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })