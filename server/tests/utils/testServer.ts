import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import path from "path";
import { Context, prisma } from "../../src/context";

export const startTestServer = async (userId?: number | string) => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        path.join(__dirname, "../../src/graphql/resolvers/**/*.{ts,js}"),
      ],
    }),
    context: {
      prisma,
      req: {
        session: {
          userId,
          destroy: () => null,
        },
      },
      res: {
        clearCookie: () => null,
        // for mocking logout
      },
    },
  });

  await server.start();
  // eslint-disable-next-line
  console.log(`Test server running...`);

  return { server };
};
