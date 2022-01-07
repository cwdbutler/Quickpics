import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();
const port = 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

// async function main() {
//   // const post = await prisma.post.create({
//   //   data: {
//   //     caption: "another post",
//   //   },
//   // });

//   const allPosts = await prisma.post.findMany();
//   console.dir(allPosts);
// }

// main().catch((e) => {
//   throw e;
// });

app.get("/", async (_, res) => {
  const allPosts = await prisma.post.findMany();
  res.send(allPosts);
});
