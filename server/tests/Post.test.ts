import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import { NOT_FOUND } from "../src/utils/constants";

beforeAll(async () => {
  await prisma.user.create({
    data: {
      username: "testuser",
      passwordHash: "notrelevantforthistest",
      posts: {
        create: [
          {
            caption: "testing",
          },
          {
            caption: "another test",
          },
          {
            caption: "third test post",
          },
        ],
      },
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Posts", () => {
  describe("Not logged in", () => {
    test("finding a post by id", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          query {
            post(id: 1) {
              id
            }
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        post: {
          id: "1",
        },
      });
    });

    test("listing all posts", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          query {
            allPosts {
              caption
            }
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        allPosts: [
          {
            caption: "testing",
          },
          {
            caption: "another test",
          },
          {
            caption: "third test post",
          },
        ],
      });
    });

    test("creating a post", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          mutation createPost {
            createPost(caption: "created post") {
              post {
                id
                caption
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: "created post",
        },
      });

      expect(dbPost).toBeFalsy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        createPost: {
          post: null,
          errors: [
            {
              field: "user",
              message: "You must be logged in to do that",
            },
          ],
        },
      });
    });

    test("updating a post", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost {
            updatePost(id: 4, caption: "updated post") {
              post {
                id
                caption
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: "updated post",
        },
      });

      expect(dbPost).toBeFalsy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updatePost: {
          post: null,
          errors: [
            {
              field: "user",
              message: "You don't have permission to do that",
            },
          ],
        },
      });
    });

    test("deleting a post", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          mutation deletePost {
            deletePost(id: 4) {
              post {
                id
                caption
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: 4,
        },
      });

      expect(dbPost).toBeFalsy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          post: null,
          errors: [
            {
              field: "user",
              message: "You don't have permission to do that",
            },
          ],
        },
      });
    });
  });

  describe("Logged in (good credentials)", () => {
    test("creating a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation createPost {
            createPost(caption: "created post") {
              post {
                id
                caption
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: "created post",
        },
      });

      expect(dbPost).toBeTruthy(); // Prisma returns null if not found

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        createPost: {
          post: {
            caption: "created post",
            id: `${dbPost.id}`,
          },
        },
      });
    });

    test("updating a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost {
            updatePost(id: 4, caption: "updated post") {
              post {
                id
                caption
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: "updated post",
        },
      });

      expect(dbPost).toBeTruthy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updatePost: {
          errors: null,
          post: {
            caption: "updated post",
            id: `${dbPost.id}`,
          },
        },
      });
    });

    test("updating a post that doesn't exist", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost {
            updatePost(id: 999, caption: "I don't exist") {
              post {
                id
                caption
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
        updatePost: {
          errors: [
            {
              field: "id",
              message: NOT_FOUND("post"),
            },
          ],
          post: null,
        },
      });
    });

    test("deleting a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation deletePost {
            deletePost(id: 4) {
              post {
                id
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: 4,
        },
      });

      expect(dbPost).toBeNull();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          errors: null,
          post: {
            id: "4",
          },
        },
      });
    });

    test("deleting a post that doesn't exist", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation deletePost {
            deletePost(id: 999) {
              post {
                id
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      expect(res.data.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          errors: [
            {
              field: "id",
              message: NOT_FOUND("post"),
            },
          ],
          post: null,
        },
      });
    });
  });

  describe("Logged in (bad credentials)", () => {
    // Post id 3 still exists

    test("updating a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 999, // not the author
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost {
            updatePost(id: 3, caption: "bad update") {
              post {
                id
                caption
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          id: 3,
          caption: "bad update",
        },
      });

      expect(dbPost).toBeFalsy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updatePost: {
          post: null,
          errors: [
            {
              field: "user",
              message: "You don't have permission to do that",
            },
          ],
        },
      });
    });

    test("deleting a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 999,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation deletePost {
            deletePost(id: 3) {
              post {
                id
              }
              errors {
                field
                message
              }
            }
          }
        `,
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: 3,
        },
      });

      expect(dbPost).toBeTruthy();
      // checking it hasn't been deleted

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          post: null,
          errors: [
            {
              field: "user",
              message: "You don't have permission to do that",
            },
          ],
        },
      });
    });
  });
});
