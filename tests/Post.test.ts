import { startTestServer } from "./testServer";
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
});
