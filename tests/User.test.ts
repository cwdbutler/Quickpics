import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { context } from "../src/context";
const { prisma } = context;
import { NOT_UNIQUE } from "../src/graphql/constants";

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

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      register: {
        errors: null,
        user: {
          id: "1",
          username: "testuser",
        },
      },
    });

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

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      register: {
        errors: [
          {
            field: "username",
            message: NOT_UNIQUE("username"),
          },
        ],
        user: null,
      },
    });
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

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      user: {
        id: "1",
        username: "testuser",
      },
    });
  });

  test("logging in with bad username", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const login = gql`
      mutation login {
        login(username: "nonexistentuser", password: "abc123") {
          user {
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
      query: login,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      login: {
        errors: [
          {
            field: "username",
            message: "Invalid username",
          },
        ],
        user: null,
      },
    });
  });

  test("logging in with bad password", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const login = gql`
      mutation login {
        login(username: "testuser", password: "wrong") {
          user {
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
      query: login,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      login: {
        errors: [
          {
            field: "password",
            message: "Invalid password",
          },
        ],
        user: null,
      },
    });
  });

  test("logging in with correct details", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const login = gql`
      mutation login {
        login(username: "testuser", password: "abc123") {
          user {
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
      query: login,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      login: {
        user: {
          username: "testuser",
        },
        errors: null,
      },
    });
  });
});
