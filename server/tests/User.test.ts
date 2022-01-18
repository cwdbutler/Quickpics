import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import faker from "faker";

const mockUser = {
  username: "testuser", // not randomised because need to test case insensitive
  password: faker.random.alphaNumeric(5),
};

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Users", () => {
  describe("User is not logged in", () => {
    test("Identifying current user", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          query {
            currentUser {
              id
            }
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        currentUser: null,
      });
    });

    describe("Registering (creating a user)", () => {
      test("Register with valid details", async () => {
        const { server } = await startTestServer();

        const res = await server.executeOperation({
          query: gql`
            mutation register($username: String!, $password: String!) {
              register(username: $username, password: $password) {
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
          variables: {
            username: mockUser.username,
            password: mockUser.password,
          },
        });

        const dbUser = await prisma.user.findUnique({
          where: {
            username: mockUser.username,
          },
        });

        expect(dbUser).toBeTruthy(); // Prisma returns null if not found

        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchObject({
          register: {
            errors: null,
            user: {
              id: `${dbUser.id}`,
              username: mockUser.username,
            },
          },
        });
      });

      describe("Register validation", () => {
        test("username taken (case insensitive)", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: gql`
              mutation register($username: String!, $password: String!) {
                register(username: $username, password: $password) {
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
            variables: {
              username: "tEsTuSeR",
              password: mockUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "username",
                  message: "Someone is already using this username",
                },
              ],
              user: null,
            },
          });
        });

        test("username too short", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: gql`
              mutation register($username: String!, $password: String!) {
                register(username: $username, password: $password) {
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
            variables: {
              username: faker.random.alphaNumeric(2),
              password: mockUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "username",
                  message: "Your username must be at least 3 characters long",
                },
              ],
              user: null,
            },
          });
        });

        test("username too long", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: gql`
              mutation register($username: String!, $password: String!) {
                register(username: $username, password: $password) {
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
            variables: {
              username: faker.random.alphaNumeric(31),
              password: "irrelevant",
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "username",
                  message:
                    "Your username cannot be greater than 30 characters long",
                },
              ],
              user: null,
            },
          });
        });

        test("password too short", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: gql`
              mutation register($username: String!, $password: String!) {
                register(username: $username, password: $password) {
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
            variables: {
              username: faker.random.alphaNumeric(5),
              password: faker.internet.password(2),
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "password",
                  message: "Your password must be at least 3 characters long",
                },
              ],
              user: null,
            },
          });
        });
      });
    });

    describe("Logging in", () => {
      test("logging in with correct details", async () => {
        const { server } = await startTestServer();

        const res = await server.executeOperation({
          query: gql`
            mutation login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
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
          variables: {
            username: mockUser.username,
            password: mockUser.password,
          },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchObject({
          login: {
            user: {
              username: mockUser.username,
            },
            errors: null,
          },
        });
      });

      describe("Login validation", () => {
        test("logging in with a nonexistent username", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: gql`
              mutation login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
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
            variables: {
              username: "nonexistentusername",
              password: mockUser.password,
            },
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

          const res = await server.executeOperation({
            query: gql`
              mutation login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
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
            variables: {
              username: mockUser.username,
              password: "wrongpassword",
            },
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
      });
    });
  });

  describe("User is logged in", () => {
    test("Identifying current user", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          query {
            currentUser {
              id
            }
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        currentUser: {
          id: "1",
        },
      });
    });

    test("logging out", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });
      /* you can "log out" without being logged in and it still returns true,
      but it seems pointless to make another test for this */

      const res = await server.executeOperation({
        query: gql`
          mutation {
            logout
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      /* checking for GraphQL errors. this is usually implicitly tested
      however this resolver only responds with a boolean so i'm checking it here */
      expect(res.data).toMatchObject({
        logout: true,
      });
    });

    test("logging in when already logged in", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      // correct details
      const res = await server.executeOperation({
        query: gql`
          mutation login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
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
        variables: {
          username: mockUser.username,
          password: mockUser.password,
        },
      });

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Already authenticated");
      expect(res.data).toBeNull();
    });
  });

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
});
