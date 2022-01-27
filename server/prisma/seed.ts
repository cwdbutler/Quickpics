import { PrismaClient } from "@prisma/client";
import { users } from "./users";
import { posts } from "./posts";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  /* you may need to run this if you have existing users,
  as the post data assumes user ids of 1-10:
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`; */

  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;

  for (let user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        username: user.username,
        passwordHash: hashed,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  for (let post of posts) {
    await prisma.post.create({
      data: {
        id: post.id,
        caption: post.caption,
        imageUrl: `https://picsum.photos/id/${
          Math.floor(Math.random() * (1001 - 1 + 1)) + 1
        }/1000/1000`,
        authorId: post.authorId,
      },
    });
  }
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
