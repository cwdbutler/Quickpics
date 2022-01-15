import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import { NOT_UNIQUE, TOO_SHORT } from "../src/utils/constants";

beforeAll(async () => {
  await prisma.user.create({
    data: {
      username: "firstuser",
      passwordHash: "implicitlytested",
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Users", () => {
  test("finding a user by id", async () => {
    const { server } = await startTestServer();

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
        username: "firstuser",
      },
    });
  });

  test("creating a user (registering)", async () => {
    const { server } = await startTestServer();

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
          id: "2",
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

  test("creating a user with an existing username (case insensitive)", async () => {
    const { server } = await startTestServer();

    const register = gql`
      mutation register {
        register(username: "tEsTuSeR", password: "abc123") {
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

  test("creating a user with a short username", async () => {
    const { server } = await startTestServer();

    const register = gql`
      mutation register {
        register(username: "a", password: "abc123") {
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
            message: TOO_SHORT("username"),
          },
        ],
        user: null,
      },
    });
  });

  test("creating a user with a short password", async () => {
    const { server } = await startTestServer();

    const register = gql`
      mutation register {
        register(username: "user123", password: "a") {
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
            field: "password",
            message: TOO_SHORT("password"),
          },
        ],
        user: null,
      },
    });
  });

  test("logging in with wrong username", async () => {
    const { server } = await startTestServer();

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

  test("logging in with wrong password", async () => {
    const { server } = await startTestServer();

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
    const { server } = await startTestServer();

    const login = gql`
      mutation login {
        login(username: "testuser", password: "abc123") {
          user {
            username
            id
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
          id: "2",
        },
        errors: null,
      },
    });
  });
});
