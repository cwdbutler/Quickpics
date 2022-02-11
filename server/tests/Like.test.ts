import { PrismaClient } from "@prisma/client";
import gql from "graphql-tag";
import { createId } from "../src/utils/createId";
import { startTestServer } from "./utils/testServer";

const prisma = new PrismaClient();

const testPost1 = {
  id: createId(),
  caption: "test post 1",
  imageUrl: "post1.jpg",
};

beforeAll(async () => {
  await prisma.user.create({
    data: {
      username: "testuser",
      email: "test@example.com",
      passwordHash: "notrelevant",
      posts: {
        create: [
          {
            id: testPost1.id,
            caption: testPost1.caption,
            imageUrl: testPost1.imageUrl,
          },
        ],
      },
    },
  });

  await prisma.activity.create({
    data: { id: testPost1.id, model: "post", userId: 1 },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Like", () => {
  const like = gql`
    mutation ($entityId: String!) {
      like(entityId: $entityId)
    }
  `;

  test("Liking when not logged in", async () => {
    const { server } = await startTestServer();

    const res = await server.executeOperation({
      query: like,
      variables: {
        entityId: testPost1.id,
      },
    });

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toEqual("Not authenticated");
    expect(res.data).toBeNull();
  });

  test("liking a post that doesn't exist", async () => {
    const { server } = await startTestServer({
      user: {
        id: 1,
      },
    });

    const res = await server.executeOperation({
      query: like,
      variables: {
        entityId: "idontexist",
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.like).toEqual(false);
  });

  test("liking a valid post", async () => {
    const { server } = await startTestServer({
      user: {
        id: 1,
      },
    });

    const res = await server.executeOperation({
      query: like,
      variables: {
        entityId: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.like).toEqual(true);
  });

  test("liking a post twice", async () => {
    const { server } = await startTestServer({
      user: {
        id: 1,
      },
    });

    const res = await server.executeOperation({
      query: like,
      variables: {
        entityId: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.like).toEqual(false);
  });

  const removeLike = gql`
    mutation ($entityId: String!) {
      removeLike(entityId: $entityId)
    }
  `;

  test("removing a like on a post that doesn't exist", async () => {
    const { server } = await startTestServer({
      user: {
        id: 1,
      },
    });

    const res = await server.executeOperation({
      query: removeLike,
      variables: {
        entityId: "idontexist",
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.removeLike).toEqual(false);
  });

  test("removing a like on a post that you have liked", async () => {
    const { server } = await startTestServer({
      user: {
        id: 1,
      },
    });

    const res = await server.executeOperation({
      query: removeLike,
      variables: {
        entityId: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.removeLike).toEqual(true);
  });

  test("removing a like on a post that you haven't liked", async () => {
    const { server } = await startTestServer({
      user: {
        id: 1,
      },
    });

    const res = await server.executeOperation({
      query: removeLike,
      variables: {
        entityId: testPost1.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.removeLike).toEqual(false);
  });
});
