import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import path from "path";

export const startTestServer = async ({ context = {} } = {}) => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        path.join(__dirname, "../../src/graphql/resolvers/**/*.{ts,js}"),
      ],
    }),
    context,
  });

  await server.start();
  // eslint-disable-next-line
  console.log(`Test server running...`);

  return { server };
};
