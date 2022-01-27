import { posts } from "./posts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  for (let post of posts) {
    await prisma.post.create({
      data: post,
    });
  }
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
