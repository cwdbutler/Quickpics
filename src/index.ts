import { PrismaClient } from "@prisma/client";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./Post/PostResolver";
import { context } from "./context";

const port = 4000;
const prisma = new PrismaClient({
  log: ["query"],
});

const startServer = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      emitSchemaFile: {
        sortedSchema: false,
      },
    }),
    context: context,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
  });
};

startServer().catch((err) => {
  throw err;
});
