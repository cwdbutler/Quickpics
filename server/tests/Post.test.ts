import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import { NOT_FOUND } from "../src/utils/constants";
import { nanoid } from "../src/utils/generateNanoId";
import faker from "faker";

// generating fake random data
const mockPost1 = {
  id: nanoid(),
  caption: faker.lorem.sentence(5),
};
const mockPost2 = {
  id: nanoid(),
  caption: faker.lorem.sentence(5),
};
const mockPost3 = {
  id: nanoid(),
  caption: faker.lorem.sentence(5),
};

beforeAll(async () => {
  await prisma.user.create({
    data: {
      username: "testuser",
      passwordHash: "notrelevantforthistest",
      posts: {
        create: [mockPost1, mockPost2, mockPost3],
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
          query ($id: String!) {
            post(id: $id) {
              id
              caption
            }
          }
        `,
        variables: {
          id: mockPost1.id,
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        post: {
          id: mockPost1.id,
          caption: mockPost1.caption,
        },
      });
    });

    test("listing all posts", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: gql`
          query {
            allPosts {
              id
              caption
            }
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      // testing behaviour not state; the order is not important
      expect(res.data.allPosts).toContainEqual(mockPost1);
      expect(res.data.allPosts).toContainEqual(mockPost2);
      expect(res.data.allPosts).toContainEqual(mockPost3);
    });

    test("creating a post", async () => {
      const { server } = await startTestServer();

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: gql`
          mutation createPost($caption: String!) {
            createPost(caption: $caption) {
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
        variables: {
          caption: mockCaption,
        },
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: mockCaption,
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

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost($id: String!, $caption: String!) {
            updatePost(id: $id, caption: $caption) {
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
        variables: {
          id: mockPost1.id,
          caption: mockCaption,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: mockPost1.id,
        },
      });

      // check data is unaltered
      expect(dbPost.caption).toEqual(mockPost1.caption);

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
          mutation deletePost($id: String!) {
            deletePost(id: $id) {
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
        variables: {
          id: mockPost1.id,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: mockPost1.id,
        },
      });

      expect(dbPost).toBeTruthy(); // not deleted

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

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: gql`
          mutation createPost($caption: String!) {
            createPost(caption: $caption) {
              post {
                id
                caption
              }
            }
          }
        `,
        variables: {
          caption: mockCaption,
        },
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: mockCaption,
        },
      });
      // checking no post was created with this caption
      expect(dbPost).toBeTruthy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        createPost: {
          post: {
            caption: mockCaption,
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

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost($id: String!, $caption: String!) {
            updatePost(id: $id, caption: $caption) {
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
        variables: {
          id: mockPost2.id,
          caption: mockCaption,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: mockPost2.id,
        },
      });

      expect(dbPost).toBeTruthy();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updatePost: {
          errors: null,
          post: {
            caption: mockCaption,
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
            updatePost(id: "thewrongid", caption: "I don't exist") {
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
          mutation deletePost($id: String!) {
            deletePost(id: $id) {
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
        variables: {
          id: mockPost2.id,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: mockPost2.id,
        },
      });

      expect(dbPost).toBeNull();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          errors: null,
          post: {
            id: mockPost2.id,
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
            deletePost(id: "thewrongid") {
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
    test("updating a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 999, // not the author
        },
      });

      const res = await server.executeOperation({
        query: gql`
          mutation updatePost($id: String!, $caption: String!) {
            updatePost(id: $id, caption: $caption) {
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
        variables: {
          id: mockPost3.id,
          caption: "I shouldn't be updated",
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: mockPost3.id,
        },
      });

      expect(dbPost.caption).toEqual(mockPost3.caption);

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
          mutation deletePost($id: String!) {
            deletePost(id: $id) {
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
        variables: {
          id: mockPost3.id,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: mockPost3.id,
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
