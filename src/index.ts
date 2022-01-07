import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.create({
    data: {
      caption: "First post",
    },
  });
  console.log(post);
}

main().catch((e) => {
  throw e;
});
