A photo sharing app, currently building the backend in Express/Apollo/GraphQL.

Plan to link it to a React frontend, also in TypeScript

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

Running tests:

```
yarn test
```

You must first create a database called quickphotos-test for this to work
