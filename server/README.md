The technologies I'm using are:

- Prisma (ORM)
- TypeGraphQL for generating the GraphQL schema using a code first approach (I've emitted the generated schema in the root directory for reference)
- Apollo Server
- Express for using middleware that I have experiene with (express-session)

Starting the server:

```
yarn dev
```

Automatically recompile (new terminal):

```
yarn watch
```

Run these two together and TypeScript changes in /src automatically recompile and restart the server.

ESLint currently not working as the typegraphql plugin doesn't support ESLint 8.0

Testing is done by creating a new schema (identified by a randomly generated string) and connecting to the test database, before starting a test server.
All data is wiped after each testing run.

Running tests:

```
yarn test
```

You must first create a database called quickpics-test for this to work
