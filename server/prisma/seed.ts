import { PrismaClient } from "@prisma/client";
import { users } from "./users";
import { posts } from "./posts";
import bcrypt from "bcrypt";
import { randomNum } from "../src/utils//randomNum";

const prisma = new PrismaClient();

const main = async () => {
  /* you may need to run this if you have existing users,
  as the post data assumes user ids of 1-10: */
  // await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  // may also need to wipe the activity database:
  // await prisma.$executeRaw`TRUNCATE TABLE "Activity";`;

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
    const userId = randomNum(10);
    await prisma.$transaction([
      prisma.post.create({
        data: {
          id: post.id,
          caption: post.caption,
          imageUrl: `https://picsum.photos/id/${randomNum(1000)}/1000/1000`,
          authorId: userId,
        },
      }), // some imageUrls may return 404
      prisma.activity.create({
        data: { id: post.id, model: "post", userId: userId },
      }),
    ]);
  }
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
