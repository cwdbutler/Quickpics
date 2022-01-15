import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import { BAD_CREDENTIALS, NOT_UNIQUE, TOO_SHORT } from "../src/utils/constants";

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

    const res = await server.executeOperation({
      query: gql`
        query {
          user(id: 1) {
            id
          }
        }
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      user: {
        id: "1",
      },
    });
  });

  test("creating a user (registering)", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        username: "testuser",
      },
    });

    expect(dbUser).toBeTruthy(); // Prisma returns null if not found

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      register: {
        errors: null,
        user: {
          id: `${dbUser.id}`,
          username: "testuser",
        },
      },
    });
  });

  test("creating a user with an existing username (case insensitive)", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
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

  test("creating a user with an insufficiently long username", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
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

  test("creating a user with an insufficiently long", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
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

  test("logging in with a nonexistent username", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      login: {
        errors: [
          {
            field: "username",
            message: BAD_CREDENTIALS("username"),
          },
        ],
        user: null,
      },
    });
  });

  test("logging in with wrong password", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      login: {
        errors: [
          {
            field: "password",
            message: BAD_CREDENTIALS("password"),
          },
        ],
        user: null,
      },
    });
  });

  test("logging in with correct details", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
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
      `,
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
