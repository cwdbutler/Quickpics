import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import faker from "faker";
import { createId } from "../src/utils/createId";
import { FORBIDDEN_USERNAMES } from "../src/utils/constants";

const testUser = {
  username: "testUser", // not randomised because need to test case insensitive
  email: "test@example.com",
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
      const registerMutation = gql`
        mutation ($username: String!, $email: String!, $password: String!) {
          register(username: $username, email: $email, password: $password) {
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

      test("Register with valid details", async () => {
        const { server } = await startTestServer();

        const res = await server.executeOperation({
          query: registerMutation,
          variables: {
            username: testUser.username,
            email: testUser.email,
            password: testUser.password,
          },
        });

        const dbUser = await prisma.user.findUnique({
          where: {
            username: testUser.username,
          },
        });

        expect(dbUser).toBeTruthy(); // Prisma returns null if not found

        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchObject({
          register: {
            errors: null,
            user: {
              id: `${dbUser.id}`,
              username: testUser.username,
            },
          },
        });
      });

      describe("Register validation", () => {
        test("invalid email", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: faker.random.alphaNumeric(5),
              email: "notanemail", // can't possibly test every invalid email string, just testing an error is returned when the regex matches
              password: testUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "email",
                  message: "Invalid email",
                },
              ],
              user: null,
            },
          });
        });

        test("email taken (case insensitive)", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: faker.random.alphaNumeric(5),
              email: testUser.email,
              password: testUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "email",
                  message: "Someone is already using this email",
                },
              ],
              user: null,
            },
          });
        });

        test("username taken (case insensitive)", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: "tEsTuSeR",
              email: "nottaken@example.com",
              password: testUser.password,
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

        test("username empty", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: "",
              email: "nottaken@example.com",
              password: testUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "username",
                  message: "Must be at least 1 characters long",
                },
              ],
              user: null,
            },
          });
        });

        test("non-alphanumeric username", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: "!£$%^&*()_+}{][-=~@#'?></.,|",
              email: "nottaken@example.com",
              password: testUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "username",
                  message: "Usernames can only be letters and numbers",
                },
              ],
              user: null,
            },
          });
        });

        test("username too long", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: faker.random.alphaNumeric(31),
              email: "nottaken@example.com",
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

        test.each(FORBIDDEN_USERNAMES)(
          "username is forbidden",
          async (username) => {
            const { server } = await startTestServer();

            const res = await server.executeOperation({
              query: registerMutation,
              variables: {
                username: username,
                email: "nottaken@example.com",
                password: "irrelevant",
              },
            });

            expect(res.errors).toBeUndefined();
            expect(res.data).toMatchObject({
              register: {
                errors: [
                  {
                    field: "username",
                    message: "That username is not allowed",
                  },
                ],
                user: null,
              },
            });
          }
        );

        test("password too short", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: registerMutation,
            variables: {
              username: faker.random.alphaNumeric(5),
              email: "nottaken@example.com",
              password: faker.internet.password(2),
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            register: {
              errors: [
                {
                  field: "password",
                  message: "Must be at least 3 characters long",
                },
              ],
              user: null,
            },
          });
        });
      });
    });

    describe("Logging in", () => {
      const loginMutation = gql`
        mutation login($emailOrUsername: String!, $password: String!) {
          login(emailOrUsername: $emailOrUsername, password: $password) {
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

      test("logging in with correct details", async () => {
        const { server } = await startTestServer();

        const res = await server.executeOperation({
          query: loginMutation,
          variables: {
            emailOrUsername: testUser.username,
            password: testUser.password,
          },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchObject({
          login: {
            user: {
              username: testUser.username,
            },
            errors: null,
          },
        });
      });

      describe("Login validation", () => {
        test("logging in with a nonexistent username", async () => {
          // impossible to test nonexistent email as it returns the same thing
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: loginMutation,
            variables: {
              emailOrUsername: "nonexistentusername",
              password: testUser.password,
            },
          });

          expect(res.errors).toBeUndefined();
          expect(res.data).toMatchObject({
            login: {
              errors: [
                {
                  field: "emailOrUsername",
                  message: "Invalid username or email",
                },
              ],
              user: null,
            },
          });
        });

        test("logging in with wrong password", async () => {
          const { server } = await startTestServer();

          const res = await server.executeOperation({
            query: loginMutation,
            variables: {
              emailOrUsername: testUser.username,
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

    test("viewing your own email", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: userQuery,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        user: {
          id: "1",
          email: testUser.email, // you can see your own email
          postCount: 0,
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
          mutation ($emailOrUsername: String!, $password: String!) {
            login(emailOrUsername: $emailOrUsername, password: $password) {
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
          emailOrUsername: testUser.username,
          password: testUser.password,
        },
      });

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Already authenticated");
      expect(res.data).toBeNull();
    });
  });

  // the tests in this main block are not dependent on the user's authentication state

  const userQuery = gql`
    query {
      user(id: 1) {
        id
        email
        postCount
      }
    }
  `;

  test("finding a user", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: userQuery,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      user: {
        id: "1",
        email: "", // testing that users cannot see other users email
        postCount: 0,
      },
    });
  });

  test("finding a user without specifying an id or username", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query {
          user {
            id
            email
            postCount
          }
        }
      `,
    });

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toEqual("You must specify an id or username");
    expect(res.data.user).toBeNull();
  });

  test("users post count is updated", async () => {
    await prisma.post.create({
      data: {
        id: createId(),
        caption: faker.lorem.sentence(5),
        imageUrl: "post1.jpg",
        author: {
          connect: {
            id: 1,
          },
        },
      },
    });

    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: userQuery,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      user: {
        id: "1",
        email: "",
        postCount: 1,
      },
    });
  });

  test("viewing suggested users (users with the most posts)", async () => {
    // create some more users with posts
    await prisma.user.create({
      data: {
        username: "userwith2posts",
        email: "test2@example.com",
        passwordHash: "notrelevantforthistest",
        posts: {
          create: [
            {
              id: createId(),
              caption: faker.lorem.sentence(5),
              imageUrl: "doesntmatter.jpg",
            },
            {
              id: createId(),
              caption: faker.lorem.sentence(5),
              imageUrl: "doesntmatter.jpg",
            },
          ],
        },
      },
    });

    await prisma.user.create({
      data: {
        username: "userwith3posts",
        email: "test3@example.com",
        passwordHash: "notrelevantforthistest",
        posts: {
          create: [
            {
              id: createId(),
              caption: faker.lorem.sentence(5),
              imageUrl: "doesntmatter.jpg",
            },
            {
              id: createId(),
              caption: faker.lorem.sentence(5),
              imageUrl: "doesntmatter.jpg",
            },
            {
              id: createId(),
              caption: faker.lorem.sentence(5),
              imageUrl: "doesntmatter.jpg",
            },
          ],
        },
      },
    });

    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query {
          suggestedUsers {
            username
            postCount
          }
        }
      `,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      suggestedUsers: [
        {
          postCount: 3,
          username: "userwith3posts",
        },
        {
          postCount: 2,
          username: "userwith2posts",
        },
        {
          postCount: 1,
          username: "testUser",
        },
      ],
    });
  });
});
