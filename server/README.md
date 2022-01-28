## Current state of tests:

![Tests](https://i.gyazo.com/70dec3e89133fcc605cf44625871f904.png)

The technologies I'm using are:

- Prisma (ORM)
- TypeGraphQL for generating the GraphQL schema using a code first approach (I've omitted the generated schema in the root directory for reference)
- Apollo Server
- Express for using middleware that I have experiene with (express-session)

Setup:
Create a database and save the url in .env

```
npx prisma generate
npx prisma migrate dev

yarn watch
```

once it has compiled to /dist:

```
yarn dev
```

Seeding the database (additional instructions in /prisma/seed.ts)

```
npx prisma db seed
```

For options/troubleshooting when seeding, refer to the comments in the seed.ts file.
Includes an option to generate posts with a date in the last week, for more realistic data, at the cost of it being unique to you.

Removed eslint as there were compatibility issues with typegraphql

Testing is done by creating a new schema (identified by a randomly generated string) and connecting to the test database, before starting a test server.
All data is wiped after each testing run.

Running tests:

```
yarn test
```

You must first create a database called quickpics-test for this to work
