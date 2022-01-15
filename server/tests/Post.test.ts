import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { prisma } from "../src/context";
import { NOT_FOUND } from "../src/utils/constants";

beforeAll(async () => {
  await prisma.post.createMany({
    data: [
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

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Posts", () => {
  test("finding a post by id", async () => {
    const { server } = await startTestServer();

    const postQuery = gql`
      query {
        post(id: 1) {
          id
          caption
        }
      }
    `;

    const res = await server.executeOperation({
      query: postQuery,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        caption: "testing",
        id: "1",
      },
    });
  });

  test("listing all posts", async () => {
    const { server } = await startTestServer();

    const postsQuery = gql`
      query {
        posts {
          id
          caption
        }
      }
    `;

    const res = await server.executeOperation({
      query: postsQuery,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      posts: [
        {
          caption: "testing",
          id: "1",
        },
        {
          caption: "another test",
          id: "2",
        },
        {
          caption: "third test post",
          id: "3",
        },
      ],
    });
  });

  test("creating a post", async () => {
    const { server } = await startTestServer();

    const createPostMutation = gql`
      mutation createPost {
        createPost(caption: "created post") {
          post {
            id
            caption
          }
        }
      }
    `;

    const res = await server.executeOperation({
      query: createPostMutation,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      createPost: {
        post: {
          caption: "created post",
          id: "4",
        },
      },
    });

    const dbPost = await prisma.post.findUnique({
      where: {
        id: parseInt(res.data.createPost.post.id),
      },
    });

    expect(dbPost).toBeTruthy(); // Prisma returns null if not found
    expect(dbPost.caption).toEqual("created post");
  });

  test("updating a post", async () => {
    const { server } = await startTestServer();

    const updatePostMutation = gql`
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
    `;

    const res = await server.executeOperation({
      query: updatePostMutation,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      updatePost: {
        errors: null,
        post: {
          caption: "updated post",
          id: "4",
        },
      },
    });

    const dbPost = await prisma.post.findUnique({
      where: {
        id: parseInt(res.data.updatePost.post.id),
      },
    });

    expect(dbPost).toBeTruthy();
    expect(dbPost.caption).toEqual("updated post");
  });

  test("updating a post that doesn't exist", async () => {
    const { server } = await startTestServer();

    const updatePostMutation = gql`
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
    `;

    const res = await server.executeOperation({
      query: updatePostMutation,
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
    const { server } = await startTestServer();

    const deletePostMutation = gql`
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
    `;

    const res = await server.executeOperation({
      query: deletePostMutation,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      deletePost: {
        errors: null,
        post: {
          id: "4",
        },
      },
    });

    const dbPost = await prisma.post.findUnique({
      where: {
        id: parseInt(res.data.deletePost.post.id),
      },
    });

    expect(dbPost).toBeNull();
  });

  test("deleting a post that doesn't exist", async () => {
    const { server } = await startTestServer();

    const deletePostMutation = gql`
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
    `;

    const res = await server.executeOperation({
      query: deletePostMutation,
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
