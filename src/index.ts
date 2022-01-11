import express from "express";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { context } from "./context";
import path from "path";

const port = 4000;

const startServer = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/graphql/resolvers/**/*.{ts,js}"],
      emitSchemaFile: {
        path: path.join(__dirname, "../src/graphql/schema.gql"),
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
