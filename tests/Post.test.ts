import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { context } from "../src/context";
const { prisma } = context;

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
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

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

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "post": Object {
            "caption": "testing",
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
  });

  test("listing all posts", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

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

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "posts": Array [
            Object {
              "caption": "testing",
              "id": "1",
            },
            Object {
              "caption": "another test",
              "id": "2",
            },
            Object {
              "caption": "third test post",
              "id": "3",
            },
          ],
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

  test("creating a post", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const createPostMutation = gql`
      mutation createPost {
        createPost(caption: "created post") {
          id
          caption
        }
      }
    `;

    const res = await server.executeOperation({
      query: createPostMutation,
    });

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "createPost": Object {
            "caption": "created post",
            "id": "4",
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

    const dbPost = await prisma.post.findUnique({
      where: {
        id: parseInt(res.data.createPost.id),
      },
    });

    expect(dbPost).toBeTruthy(); // Prisma returns null if not found
    expect(dbPost.caption).toEqual("created post");
  });

  test("updating a post", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

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

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "updatePost": Object {
            "errors": null,
            "post": Object {
              "caption": "updated post",
              "id": "4",
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

    const dbPost = await prisma.post.findUnique({
      where: {
        id: parseInt(res.data.updatePost.post.id),
      },
    });

    expect(dbPost).toBeTruthy(); // Prisma returns null if not found
    expect(dbPost.caption).toEqual("updated post");
  });

  test("updating a post that doesn't exist", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

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

    expect(res).toMatchInlineSnapshot(`
       Object {
         "data": Object {
           "updatePost": Object {
             "errors": null,
             "post": Object {
               "caption": "updated post",
               "id": "4",
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
  });

  test("deleting a post", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

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

    expect(res).toMatchInlineSnapshot(`
       Object {
         "data": Object {
           "deletePost": Object {
             "errors": null,
             "post": Object {
               "id": "4",
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

    const dbPost = await prisma.post.findUnique({
      where: {
        id: parseInt(res.data.deletePost.post.id),
      },
    });

    expect(dbPost).toBeNull(); // Prisma returns null if not found
  });

  test("deleting a post that doesn't exist", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

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
  });
});
