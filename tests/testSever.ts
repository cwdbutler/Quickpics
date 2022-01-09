import { ApolloServer } from "apollo-server-express";
import { PostResolver } from "../src/PostResolver";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

export const startTestServer = async ({ context = {} } = {}) => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
    }),
    context,
  });

  await server.start();
  // eslint-disable-next-line
  console.log(`Test server running...`);

  return { server };
};
