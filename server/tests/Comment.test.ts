import { PrismaClient } from "@prisma/client";
import faker from "faker";
import gql from "graphql-tag";
import { createId } from "../src/utils/createId";
import { startTestServer } from "./utils/testServer";

const prisma = new PrismaClient();

const testComment1 = {
  id: createId(),
  text: "test comment 1",
};
const testComment2 = {
  id: createId(),
  text: "test comment 2",
};
const testComment3 = {
  id: createId(),
  text: "test comment 3",
};
const testPostWithComments = {
  id: createId(),
  caption: "post with comments",
  imageUrl: "postwithcomments.jpg",
  comments: [testComment1, testComment2, testComment3],
};

beforeAll(async () => {
  let now = new Date();
  let oneDayAgo = new Date(now.getTime() - 86400000);
  let twoDaysAgo = new Date(now.getTime() - 172800000);
  let threeDaysAgo = new Date(now.getTime() - 259200000);
  let oneWeekAgo = new Date(now.getTime() - 604800000);

  await prisma.user.create({
    data: {
      username: "testuser",
      email: "test@example.com",
      passwordHash: "notrelevant",
    },
  });
  await prisma.user.create({
    data: {
      username: "testuser2",
      email: "test2@example.com",
      passwordHash: "notrelevant",
      posts: {
        create: [
          {
            id: testPostWithComments.id,
            caption: testPostWithComments.caption,
            imageUrl: testPostWithComments.imageUrl,
            createdAt: oneWeekAgo,
            comments: {
              create: [
                {
                  id: testComment1.id,
                  text: testComment1.text,
                  author: {
                    connect: {
                      id: 1,
                    },
                  },
                  createdAt: oneDayAgo,
                },
                {
                  id: testComment2.id,
                  text: testComment2.text,
                  author: {
                    connect: {
                      id: 2,
                    },
                  },
                  createdAt: twoDaysAgo,
                },
                {
                  id: testComment3.id,
                  text: testComment3.text,
                  author: {
                    connect: {
                      id: 2,
                    },
                  },
                  createdAt: threeDaysAgo,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // required as when deleting a comment, it also deletes the activity
  await prisma.activity.createMany({
    data: [
      { id: testComment1.id, model: "comment", userId: 1 },
      { id: testComment2.id, model: "comment", userId: 1 },
      { id: testComment3.id, model: "comment", userId: 1 },
    ],
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Comment", () => {
  // everything in this block is not dependent on the users authenticaiton state

  test("finding a comment by id", async () => {
    const { server } = await startTestServer();
    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          comment(id: $id) {
            id
            text
            likeCount
          }
        }
      `,
      variables: {
        id: testComment1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      comment: {
        id: testComment1.id,
        text: testComment1.text,
        likeCount: 0,
      },
    });
  });

  test("comment like count is updated", async () => {
    await prisma.like.create({
      data: {
        entityId: testComment1.id,
        model: "comment",
        author: {
          connect: {
            id: 1,
          },
        },
      },
    });

    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          comment(id: $id) {
            id
            text
            likeCount
          }
        }
      `,
      variables: {
        id: testComment1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      comment: {
        id: testComment1.id,
        text: testComment1.text,
        likeCount: 1,
      },
    });
  });

  test("can query likes", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          comment(id: $id) {
            id
            text
            likes {
              author {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: testComment1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      comment: {
        id: testComment1.id,
        text: testComment1.text,
        likes: [
          {
            author: {
              id: "1",
            },
          },
        ],
      },
    });
  });

  test("can query if you have liked a comment", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          comment(id: $id) {
            id
            text
            liked
          }
        }
      `,
      variables: {
        id: testComment1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      comment: {
        id: testComment1.id,
        text: testComment1.text,
        liked: false,
      },
    });
  });

  const createComment = gql`
    mutation ($text: String!, $postId: String!) {
      createComment(text: $text, postId: $postId) {
        comment {
          id
          text
        }
        errors {
          field
          message
        }
      }
    }
  `;
  const updateComment = gql`
    mutation ($id: String!, $text: String!) {
      updateComment(id: $id, text: $text) {
        comment {
          id
          text
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const deleteComment = gql`
    mutation ($id: String!) {
      deleteComment(id: $id) {
        comment {
          id
          text
        }
        errors {
          field
          message
        }
      }
    }
  `;

  describe("Not logged in", () => {
    test("creating a comment", async () => {
      const { server } = await startTestServer();

      const mockText = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: createComment,
        variables: {
          postId: testPostWithComments.id,
          text: mockText,
        },
      });

      const dbComment = await prisma.comment.findFirst({
        where: {
          text: mockText,
        },
      });

      expect(dbComment).toBeFalsy();

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });

    test("updating a comment", async () => {
      const { server } = await startTestServer();

      const mockText = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: updateComment,
        variables: {
          id: testComment1.id,
          text: mockText,
        },
      });

      const dbComment = await prisma.comment.findUnique({
        where: {
          id: testComment1.id,
        },
      });

      // check data is unaltered
      expect(dbComment.text).toEqual(testComment1.text);

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });

    test("deleting a comment", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: deleteComment,
        variables: {
          id: testComment1.id,
        },
      });

      const dbComment = await prisma.comment.findUnique({
        where: {
          id: testComment1.id,
        },
      });

      expect(dbComment).toBeTruthy(); // not deleted

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });
  });

  describe("Logged in (good credentials)", () => {
    test("creating a comment", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const mockText = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: createComment,
        variables: {
          postId: testPostWithComments.id,
          text: mockText,
        },
      });

      const dbComment = await prisma.comment.findFirst({
        where: {
          text: mockText,
        },
      });

      expect(dbComment.text).toEqual(mockText);

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        createComment: {
          comment: {
            text: mockText,
            id: `${dbComment.id}`,
          },
        },
      });
    });

    test("updating a comment", async () => {
      const { server } = await startTestServer({
        user: {
          id: 2, // the author
        },
      });

      const newMockText = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: updateComment,
        variables: {
          id: testComment2.id,
          text: newMockText,
        },
      });

      const dbComment = await prisma.comment.findUnique({
        where: {
          id: testComment2.id,
        },
      });

      expect(dbComment.text).toEqual(newMockText);

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updateComment: {
          errors: null,
          comment: {
            text: newMockText,
            id: `${dbComment.id}`,
          },
        },
      });
    });

    test("updating a comment that doesn't exist", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: updateComment,
        variables: {
          id: "idontexist",
          text: "asdf",
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updateComment: {
          errors: [
            {
              field: "id",
              message: "That comment could not be found",
            },
          ],
          comment: null,
        },
      });
    });

    test("deleting a comment", async () => {
      const { server } = await startTestServer({
        user: {
          id: 2, // the owner
        },
      });

      const res = await server.executeOperation({
        query: deleteComment,
        variables: {
          id: testComment2.id,
        },
      });

      const dbComment = await prisma.comment.findUnique({
        where: {
          id: testComment2.id,
        },
      });

      expect(dbComment).toBeNull();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deleteComment: {
          errors: null,
          comment: {
            id: testComment2.id,
          },
        },
      });
    });

    test("deleting a comment that doesn't exist", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: deleteComment,
        variables: {
          id: "idontexist",
        },
      });

      expect(res.data.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deleteComment: {
          errors: [
            {
              field: "id",
              message: "That comment could not be found",
            },
          ],
          comment: null,
        },
      });
    });

    test("can query if you have liked a comment", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1, // this user liked the comment in a previous test
        },
      });

      const res = await server.executeOperation({
        query: gql`
          query ($id: String!) {
            comment(id: $id) {
              id
              text
              liked
            }
          }
        `,
        variables: {
          id: testComment1.id,
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        comment: {
          id: testComment1.id,
          text: testComment1.text,
          liked: true,
        },
      });
    });

    describe("Logged in (the wrong user)", () => {
      test("updating a comment", async () => {
        const { server } = await startTestServer({
          user: {
            id: 999, // not the author
          },
        });

        const res = await server.executeOperation({
          query: updateComment,
          variables: {
            id: testComment1.id,
            text: "I shouldn't be updated",
          },
        });

        const dbComment = await prisma.comment.findUnique({
          where: {
            id: testComment1.id,
          },
        });

        expect(dbComment.text).toEqual(dbComment.text);

        expect(res.errors.length).toBe(1);
        expect(res.errors[0].message).toEqual(
          "You don't have permission to do that"
        );
        expect(res.data).toBeNull();
      });

      test("deleting a comment", async () => {
        const { server } = await startTestServer({
          user: {
            id: 999,
          },
        });

        const res = await server.executeOperation({
          query: deleteComment,
          variables: {
            id: testComment1.id,
          },
        });

        const dbComment = await prisma.comment.findUnique({
          where: {
            id: testComment1.id,
          },
        });

        expect(dbComment).toBeTruthy();
        // checking it hasn't been deleted

        expect(res.errors.length).toBe(1);
        expect(res.errors[0].message).toEqual(
          "You don't have permission to do that"
        );
        expect(res.data).toBeNull();
      });
    });
  });
});
