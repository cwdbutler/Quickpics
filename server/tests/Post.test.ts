import { startTestServer } from "./utils/testServer";
import gql from "graphql-tag";
import { createId } from "../src/utils/createId";
import faker from "faker";
import { PrismaClient } from "@prisma/client";
import { Upload } from "graphql-upload";
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";

jest.mock("aws-sdk", () => {
  const mockedS3 = {
    upload: jest.fn().mockReturnThis(),
    deleteObject: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { S3: jest.fn(() => mockedS3) };
});

const prisma = new PrismaClient();

// setting up the data
// storing it in  objects first so it can be referenced again in tests
const testPostToDelete = {
  id: createId(),
  caption: "delete me",
  imageUrl: "delete.jpg",
};
const testPost1 = {
  id: createId(),
  caption: "test post 1",
  imageUrl: "post1.jpg",
};
const testPost2 = {
  id: createId(),
  caption: "test post 2",
  imageUrl: "post2.jpg",
};
const testPost3 = {
  id: createId(),
  caption: "test post 3",
  imageUrl: "post3.jpg",
};
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
                      id: 1,
                    },
                  },
                  createdAt: twoDaysAgo,
                },
                {
                  id: testComment3.id,
                  text: testComment3.text,
                  author: {
                    connect: {
                      id: 1,
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

  // these are the posts pagination will be tested on
  await prisma.post.createMany({
    data: [
      {
        id: testPost1.id,
        caption: testPost1.caption,
        imageUrl: testPost1.imageUrl,
        authorId: 1,
        createdAt: oneDayAgo,
      },
      {
        id: testPost2.id,
        caption: testPost2.caption,
        imageUrl: testPost2.imageUrl,
        authorId: 1,
        createdAt: twoDaysAgo,
      },
      {
        id: testPost3.id,
        caption: testPost3.caption,
        imageUrl: testPost3.imageUrl,
        authorId: 1,
        createdAt: threeDaysAgo,
      },
    ],
  });

  await prisma.user.create({
    data: {
      username: "otheruser",
      email: "other@example.com",
      passwordHash: "notrelevant",
      posts: {
        create: [
          {
            id: testPostToDelete.id,
            caption: testPostToDelete.caption,
            imageUrl: testPostToDelete.imageUrl,
            createdAt: oneWeekAgo,
          },
        ],
      },
    },
  });

  // required as when deleting a post, it also deletes the activity
  await prisma.activity.create({
    data: { id: testPostToDelete.id, model: "post", userId: 1 },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Posts", () => {
  // everything in this block is not dependent on the users authenticaiton state

  test("finding a post by id", async () => {
    const { server } = await startTestServer();
    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            likeCount
          }
        }
      `,
      variables: {
        id: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPost1.id,
        caption: testPost1.caption,
        likeCount: 0,
      },
    });
  });

  test("post like count is updated", async () => {
    await prisma.like.create({
      data: {
        entityId: testPost1.id,
        model: "post",
        author: {
          connect: {
            id: 1, // not important for this test
          },
        },
      },
    });

    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            likeCount
          }
        }
      `,
      variables: {
        id: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPost1.id,
        caption: testPost1.caption,
        likeCount: 1,
      },
    });
  });

  test("can query likes", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            likes {
              author {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPost1.id,
        caption: testPost1.caption,
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

  test("can query if you have liked a post", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            liked
          }
        }
      `,
      variables: {
        id: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPost1.id,
        caption: testPost1.caption,
        liked: false,
      },
    });
  });

  test("can query if you have saved a post", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            saved
          }
        }
      `,
      variables: {
        id: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPost1.id,
        caption: testPost1.caption,
        saved: false,
      },
    });
  });

  test("can query for comments", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            comments {
              id
              text
              author {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: testPostWithComments.id,
      },
    });

    // comments are newest first
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPostWithComments.id,
        caption: testPostWithComments.caption,
        comments: [
          {
            id: testComment1.id,
            text: testComment1.text,
            author: {
              id: "1",
            },
          },
          {
            id: testComment2.id,
            text: testComment2.text,
            author: {
              id: "1",
            },
          },
          {
            id: testComment3.id,
            text: testComment3.text,
            author: {
              id: "1",
            },
          },
        ],
      },
    });
  });

  test("can query for the first two comments", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: gql`
        query ($id: String!) {
          post(id: $id) {
            id
            caption
            commentsPreview {
              id
              text
              author {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: testPostWithComments.id,
      },
    });

    expect(res.errors).toBeUndefined();
    // this should return the newest 2 comments
    expect(res.data).toMatchObject({
      post: {
        id: testPostWithComments.id,
        caption: testPostWithComments.caption,
        commentsPreview: [
          {
            id: testComment1.id,
            text: testComment1.text,
            author: {
              id: "1",
            },
          },
          {
            id: testComment2.id,
            text: testComment2.text,
            author: {
              id: "1",
            },
          },
        ],
      },
    });
  });

  test("can query for comment count", async () => {
    const { server } = await startTestServer();

    const postWithCommentCount = gql`
      query ($id: String!) {
        post(id: $id) {
          id
          caption
          commentCount
        }
      }
    `;

    const res = await server.executeOperation({
      query: postWithCommentCount,
      variables: {
        id: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject({
      post: {
        id: testPost1.id,
        caption: testPost1.caption,
        commentCount: 0,
      },
    });

    const res2 = await server.executeOperation({
      query: postWithCommentCount,
      variables: {
        id: testPostWithComments.id, // this has 3 comments
      },
    });

    expect(res2.errors).toBeUndefined();
    expect(res2.data).toMatchObject({
      post: {
        id: testPostWithComments.id,
        caption: testPostWithComments.caption,
        commentCount: 3,
      },
    });
  });

  describe("Paginated posts", () => {
    const posts = gql`
      query ($take: Int!, $cursor: String, $username: String) {
        posts(take: $take, cursor: $cursor, username: $username) {
          posts {
            id
            caption
            createdAt
          }
        }
      }
    `;

    test("specifying a just the take", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: posts,
        variables: {
          take: 3,
        },
      });

      console.log(res.data.posts.posts);

      expect(res.errors).toBeUndefined();
      expect(res.data.posts.posts.length).toEqual(3);
      // testing they are returned newest first
      expect(res.data.posts.posts[0].id).toEqual(testPost1.id);
      expect(res.data.posts.posts[1].id).toEqual(testPost2.id);
      expect(res.data.posts.posts[2].id).toEqual(testPost3.id);
    });

    test("specifying a user", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: posts,
        variables: {
          take: 3,
          username: "otheruser",
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data.posts.posts.length).toEqual(1);
      // this user only has 1 post
      expect(res.data.posts.posts[0].id).toEqual(testPostToDelete.id);
    });

    test("specifying the cursor", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: posts,
        variables: {
          take: 1,
          cursor: testPost2.id,
        },
      });

      console.log(res.data.posts.posts);

      // testPost1
      // testPost2 <- cursor (start here, but don't return this post)
      // testPost3  - take 1

      expect(res.errors).toBeUndefined();
      expect(res.data.posts.posts.length).toEqual(1);
      expect(res.data.posts.posts[0].id).toEqual(testPost3.id);
    });
  });

  const createPost = gql`
    mutation ($caption: String!, $file: Upload!) {
      createPost(caption: $caption, file: $file) {
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
  const updatePost = gql`
    mutation ($id: String!, $caption: String!) {
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
  `;

  const deletePost = gql`
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
  `;
  const savePost = gql`
    mutation ($id: String!) {
      savePost(id: $id)
    }
  `;

  describe("Not logged in", () => {
    test("creating a post", async () => {
      const fileName = "test.jpg";
      const file = fs.createReadStream(
        path.resolve(__dirname, `./utils/${fileName}`)
      );
      const upload = new Upload() as any; // file has to be of Upload type for graphql-upload
      upload.resolve({
        createReadStream: () => file,
        stream: file,
        filename: fileName,
        encoding: "7bit",
        mimetype: "application/png",
      });

      const { server } = await startTestServer();

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: createPost,
        variables: {
          caption: mockCaption,
          file: upload,
        },
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: mockCaption,
        },
      });

      expect(dbPost).toBeFalsy();

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });

    test("updating a post", async () => {
      const { server } = await startTestServer();

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: updatePost,
        variables: {
          id: testPost1.id,
          caption: mockCaption,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: testPost1.id,
        },
      });

      // check data is unaltered
      expect(dbPost.caption).toEqual(testPost1.caption);

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });

    test("deleting a post", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: deletePost,
        variables: {
          id: testPost1.id,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: testPost1.id,
        },
      });

      expect(dbPost).toBeTruthy(); // not deleted

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });

    test("saving a post", async () => {
      const { server } = await startTestServer();

      const res = await server.executeOperation({
        query: savePost,
        variables: {
          id: testPost1.id,
        },
      });

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual("Not authenticated");
      expect(res.data).toBeNull();
    });
  });

  describe("Logged in (good credentials)", () => {
    test("creating a post", async () => {
      const fileName = "test.jpg";
      const file = fs.createReadStream(
        path.resolve(__dirname, `./utils/${fileName}`)
      );
      const upload = new Upload() as any;
      upload.resolve({
        createReadStream: () => file,
        stream: file,
        filename: fileName,
        encoding: "7bit",
        mimetype: "application/png",
      });

      function mockUploadFile(file: any, key: string) {
        const mockedS3 = new AWS.S3({
          accessKeyId: "mock-accessKeyId",
          secretAccessKey: "mock-secretAccessKey",
          region: "mock-region",
        }) as any; // ts wasn't recognising the mock types and was using the real AWS types

        mockedS3.promise.mockResolvedValueOnce({ Location: "asdf" });

        const fileStream = file.createReadStream();
        const params = {
          ContentType: "image/jpeg",
          Bucket: "mock-bucket",
          Body: fileStream,
          Key: `${key}.jpg`,
        };

        return mockedS3.upload(params).promise();
      }

      const { server } = await startTestServer({
        user: {
          id: 1,
        },
        uploadFile: mockUploadFile,
      });

      const mockCaption = faker.lorem.sentence(5);

      const res = await server.executeOperation({
        query: createPost,
        variables: {
          caption: mockCaption,
          file: upload,
        },
      });

      const dbPost = await prisma.post.findFirst({
        where: {
          caption: mockCaption,
        },
      });
      // // checking no post was created with this caption
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
        query: updatePost,
        variables: {
          id: testPost2.id,
          caption: mockCaption,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: testPost2.id,
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
        query: updatePost,
        variables: {
          id: "idontexist",
          caption: "asdf",
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        updatePost: {
          errors: [
            {
              field: "id",
              message: "That post could not be found",
            },
          ],
          post: null,
        },
      });
    });

    test("deleting a post", async () => {
      function mockDeleteFile(id: string) {
        const mockedS3 = new AWS.S3({
          accessKeyId: "mock-accessKeyId",
          secretAccessKey: "mock-secretAccessKey",
          region: "mock-region",
        }) as any;

        const params = {
          Bucket: "mock-bucket",
          Key: `${id}.jpg`,
        };

        return mockedS3.deleteObject(params).promise();
      }

      const { server } = await startTestServer({
        user: {
          id: 2, // the owner
        },
        deleteFile: mockDeleteFile,
      });

      const res = await server.executeOperation({
        query: deletePost,
        variables: {
          id: testPostToDelete.id,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: testPostToDelete.id,
        },
      });

      expect(dbPost).toBeNull();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          errors: null,
          post: {
            id: testPostToDelete.id,
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
        query: deletePost,
        variables: {
          id: "idontexist",
        },
      });

      expect(res.data.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        deletePost: {
          errors: [
            {
              field: "id",
              message: "That post could not be found",
            },
          ],
          post: null,
        },
      });
    });

    test("can query if you have liked a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1, // this user liked the post in a previous test
        },
      });

      const res = await server.executeOperation({
        query: gql`
          query ($id: String!) {
            post(id: $id) {
              id
              caption
              liked
            }
          }
        `,
        variables: {
          id: testPost1.id,
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        post: {
          id: testPost1.id,
          caption: testPost1.caption,
          liked: true,
        },
      });
    });

    const savePost = gql`
      mutation ($id: String!) {
        savePost(id: $id)
      }
    `;

    test("saving a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: savePost,
        variables: {
          id: testPost1.id,
        },
      });

      const dbSavedPost = await prisma.usersOnPosts.findUnique({
        where: {
          postId_userId: {
            userId: 1,
            postId: testPost1.id,
          },
        },
      });

      expect(dbSavedPost.postId).toEqual(testPost1.id);
      expect(dbSavedPost.userId).toEqual(1);

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        savePost: true,
      });
    });

    test("saving a post that you have already saved", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: savePost,
        variables: {
          id: testPost1.id,
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        savePost: false,
      });
    });

    test("saving a post that doesn't exist", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: savePost,
        variables: {
          id: "idontexist",
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        savePost: false,
      });
    });

    test("can query if you have saved a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: gql`
          query ($id: String!) {
            post(id: $id) {
              id
              caption
              saved
            }
          }
        `,
        variables: {
          id: testPost1.id,
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        post: {
          caption: testPost1.caption,
          id: testPost1.id,
          saved: true,
        },
      });
    });

    const removeSavedPost = gql`
      mutation ($id: String!) {
        removeSavedPost(id: $id)
      }
    `;

    test("removing a saved post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: removeSavedPost,
        variables: {
          id: testPost1.id,
        },
      });

      const dbSavedPost = await prisma.usersOnPosts.findUnique({
        where: {
          postId_userId: {
            userId: 1,
            postId: testPost1.id,
          },
        },
      });

      expect(dbSavedPost).toBeNull();

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        removeSavedPost: true,
      });
    });

    test("removing a saved post that you haven't already saved", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: removeSavedPost,
        variables: {
          id: testPost3.id, // user with id 1 hasn't saved this
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        removeSavedPost: false,
      });
    });

    test("removing a saved post that doesn't exist", async () => {
      const { server } = await startTestServer({
        user: {
          id: 1,
        },
      });

      const res = await server.executeOperation({
        query: removeSavedPost,
        variables: {
          id: "idontexist",
        },
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchObject({
        removeSavedPost: false,
      });
    });

    describe("Paginated saved posts", () => {
      const savedPosts = gql`
        query ($take: Int!, $cursor: String) {
          savedPosts(take: $take, cursor: $cursor) {
            posts {
              id
              caption
              createdAt
            }
          }
        }
      `;

      test("saved posts (without cursor)", async () => {
        // creating some saved posts for user with id of 1
        let now = new Date();
        let oneDayAgo = new Date(now.getTime() - 86400000);
        let twoDaysAgo = new Date(now.getTime() - 172800000);
        let threeDaysAgo = new Date(now.getTime() - 259200000);
        await prisma.usersOnPosts.createMany({
          data: [
            {
              postId: testPost1.id,
              userId: 1,
              createdAt: oneDayAgo,
            },
            {
              postId: testPost2.id,
              userId: 1,
              createdAt: twoDaysAgo,
            },
            {
              postId: testPost3.id,
              userId: 1,
              createdAt: threeDaysAgo,
            },
          ],
        });

        const { server } = await startTestServer({
          user: {
            id: 1,
          },
        });

        const res = await server.executeOperation({
          query: savedPosts,
          variables: {
            take: 3,
          },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data.savedPosts.posts.length).toEqual(3);
        // these should also be newest first but haven't staggered the creations
        expect(res.data.savedPosts.posts[0].id).toEqual(testPost1.id);
        expect(res.data.savedPosts.posts[1].id).toEqual(testPost2.id);
        expect(res.data.savedPosts.posts[2].id).toEqual(testPost3.id);
      });

      test("saved posts (with cursor)", async () => {
        const { server } = await startTestServer({
          user: {
            id: 1,
          },
        });

        const res = await server.executeOperation({
          query: savedPosts,
          variables: {
            take: 3,
            cursor: testPost2.id,
          },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data.savedPosts.posts.length).toEqual(1);
        expect(res.data.savedPosts.posts[0].id).toEqual(testPost3.id);
      });
    });
  });

  describe("Logged in (the wrong user)", () => {
    test("updating a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 999, // not the author
        },
      });

      const res = await server.executeOperation({
        query: updatePost,
        variables: {
          id: testPost3.id,
          caption: "I shouldn't be updated",
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: testPost3.id,
        },
      });

      expect(dbPost.caption).toEqual(testPost3.caption);

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual(
        "You don't have permission to do that"
      );
      expect(res.data).toBeNull();
    });

    test("deleting a post", async () => {
      const { server } = await startTestServer({
        user: {
          id: 999,
        },
      });

      const res = await server.executeOperation({
        query: deletePost,
        variables: {
          id: testPost3.id,
        },
      });

      const dbPost = await prisma.post.findUnique({
        where: {
          id: testPost3.id,
        },
      });

      expect(dbPost).toBeTruthy();
      // checking it hasn't been deleted

      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toEqual(
        "You don't have permission to do that"
      );
      expect(res.data).toBeNull();
    });
  });
});
