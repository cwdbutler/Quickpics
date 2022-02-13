import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Context } from "./context";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { COOKIE_NAME, COOKIE_SECRET, IS_PROD, PORT } from "./utils/constants";
const redis = require("redis");
const session = require("express-session");
// won't work with es6 imports
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";
import { deleteFile } from "./utils/deleteFile";
import { uploadFile } from "./utils/uploadFile";

export const prisma = new PrismaClient({
  log: ["query"],
});

const startServer = async () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const RedisStore = require("connect-redis")(session);
  const redisClient = redis.createClient({ url: process.env.REDIS_URL });

  app.set("trust proxy", 1);

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: COOKIE_NAME,
      secret: COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 31536000000, // 1 year
        httpOnly: IS_PROD,
        secure: IS_PROD,
        domain: IS_PROD ? process.env.DOMAIN : undefined,
      },
    })
  );

  app.use(graphqlUploadExpress({ maxFileSize: 5_000_000, maxFiles: 1 }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/graphql/resolvers/**/*.{ts,js}"],
      emitSchemaFile: !IS_PROD
        ? {
            path: path.join(__dirname, "../src/graphql/schema.gql"),
            sortedSchema: false,
          }
        : undefined,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    // reverting to GraphQL Playground because couldn't get cookies to work in Apollo Studio
    context: ({ req, res }): Context => ({
      prisma,
      req,
      res,
      uploadFile,
      deleteFile,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });

  app.get("/", (_req, res) => {
    res.redirect("/graphql");
  });
};

startServer().catch((error) => {
  throw error;
});
