import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.create({
    data: {
      caption: "another post",
    },
  });

  const allPosts = await prisma.post.findMany();
  console.dir(allPosts);
}

main().catch((e) => {
  throw e;
});
