import { PrismaClient } from "@prisma/client";
import { users } from "./users";
import { posts } from "./posts";
import bcrypt from "bcrypt";
// import { randomTimestamp } from "../src/utils/randomTimestamp";

const prisma = new PrismaClient();

const main = async () => {
  /* you may need to run this if you have existing users,
  as the post data assumes user ids of 1-10: */
  // await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  // may also need to wipe the activity database:
  // await prisma.$executeRaw`TRUNCATE TABLE "Activity";`;
  // or the posts database (if you didn't do the above user command):
  // await prisma.$executeRaw`TRUNCATE TABLE "Post";`;

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
    // to generate data randomly within the last week, uncomment and this function and the import above:
    // const createdAt = randomTimestamp();
    // then swap it for the post.createdAt values
    await prisma.$transaction([
      prisma.post.create({
        data: {
          id: post.id,
          caption: post.caption,
          imageUrl: post.imageUrl,
          authorId: post.userId,
          createdAt: post.createdAt,
        },
      }), // some imageUrls may return 404
      prisma.activity.create({
        data: {
          id: post.id,
          model: "post",
          userId: post.userId,
          createdAt: post.createdAt,
        },
      }),
    ]);
  } // takes a random picture from picsum, some urls may return 404 so just delete those posts
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
