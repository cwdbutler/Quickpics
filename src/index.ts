import express from "express";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./PostResolver";
import { context } from "./context";
import { UserResolver } from "./UserResolver";

const port = 4000;

const startServer = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      emitSchemaFile: {
        sortedSchema: false,
      },
    }),
    context: context,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server running on port ${port}...`);
  });
};

startServer().catch((err) => {
  throw err;
});
