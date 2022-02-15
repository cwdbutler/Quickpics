# Tests:

![All tests](https://i.gyazo.com/6865b9c0015c98633c8313a5d330b7d3.png)

![User](https://i.gyazo.com/5e98b451ae7a385f4c0566e60d265da3.png)

![Post](https://i.gyazo.com/ec98fe081a19114cb2a28ad01326e829.png)

![Comment](https://i.gyazo.com/9c64047fd03e428ec77b803402f45f97.png)

![Like](https://i.gyazo.com/3ea2bbfd174e265e6d924625437949a8.png)

Setup:

```
yarn install
```

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
