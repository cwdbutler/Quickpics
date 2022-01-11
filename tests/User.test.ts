import { startTestServer } from "./utils/testServer";
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

    const register = gql`
      mutation register {
        register(username: "testuser", password: "abc123") {
          user {
            id
            username
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const res = await server.executeOperation({
      query: register,
    });

    expect(res).toMatchInlineSnapshot(`
       Object {
         "data": Object {
           "register": Object {
             "errors": null,
             "user": Object {
               "id": "1",
               "username": "testuser",
             },
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
        id: parseInt(res.data.register.user.id),
      },
    });

    expect(dbPost).toBeTruthy(); // Prisma returns null if not found
    expect(dbPost.username).toEqual("testuser");
  });

  test("creating a user with an existing username", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const register = gql`
      mutation register {
        register(username: "testuser", password: "abc123") {
          user {
            id
            username
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const res = await server.executeOperation({
      query: register,
    });

    expect(res).toMatchInlineSnapshot(`
       Object {
         "data": Object {
           "register": Object {
             "errors": Array [
               Object {
                 "field": "username",
                 "message": "Username already taken",
               },
             ],
             "user": null,
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
