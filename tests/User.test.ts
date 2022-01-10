import { startTestServer } from "./testServer";
import gql from "graphql-tag";
import { context } from "../src/context";
const { prisma } = context;

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Users", () => {
  test("creating a user", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const createUser = gql`
      mutation createUser {
        createUser(username: "testuser", password: "abc123") {
          id
        }
      }
    `;

    const res = await server.executeOperation({
      query: createUser,
    });

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "createUser": Object {
            "id": "1",
          },
        },
        "errors": undefined,
        "extensions": undefined,
        "http": Object {
          "headers": Headers {
            Symbol(map): Object {},
          },
        },
      }
    `);

    const dbPost = await prisma.user.findUnique({
      where: {
        id: parseInt(res.data.createUser.id),
      },
    });

    expect(dbPost).toBeTruthy(); // Prisma returns null if not found
    expect(dbPost.username).toEqual("testuser");
  });

  test("creating a user with an existing username", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const createUser = gql`
      mutation createUser {
        createUser(username: "testuser", password: "abc123") {
          id
        }
      }
    `;

    const res = await server.executeOperation({
      query: createUser,
    });

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "createUser": null,
        },
        "errors": undefined,
        "extensions": undefined,
        "http": Object {
          "headers": Headers {
            Symbol(map): Object {},
          },
        },
      }
    `);
  });

  test("finding a user by id", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const userQuery = gql`
      query {
        user(id: 1) {
          id
          username
        }
      }
    `;

    const res = await server.executeOperation({
      query: userQuery,
    });

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "user": Object {
            "id": "1",
            "username": "testuser",
          },
        },
        "errors": undefined,
        "extensions": undefined,
        "http": Object {
          "headers": Headers {
            Symbol(map): Object {},
          },
        },
      }
    `);
  });
});
