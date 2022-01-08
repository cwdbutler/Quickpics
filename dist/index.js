"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const test_1 = require("./resolvers/test");
const port = 4000;
const prisma = new client_1.PrismaClient({
    log: ["query"],
});
const startServer = async () => {
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [test_1.TestResolver],
            emitSchemaFile: true,
        }),
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
//# sourceMappingURL=index.js.map