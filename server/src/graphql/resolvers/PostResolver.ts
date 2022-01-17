import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../types/Post";
import { Context } from "../../context";
import { PostResponse } from "../types/PostResponse";
import { formatPrismaError } from "../../utils/formatPrismaError";
import {
  NOT_AUTHENTICATED,
  NOT_FOUND,
  NOT_LOGGED_IN,
} from "../../utils/constants";

@Resolver()
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Post])
  allPosts(@Ctx() { prisma }: Context): Promise<Post[]> {
    return prisma.post.findMany();
  }

  @Mutation(() => PostResponse)
  async createPost(
    @Arg("caption") caption: string,
    @Ctx() { prisma, req }: Context
  ): Promise<PostResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NOT_LOGGED_IN,
          },
        ],
      };
    }

    const post = await prisma.post.create({
      data: {
        caption: caption,
        author: {
          connect: {
            id: req.session.userId,
          },
        },
      },
    });

    return {
      post,
    };
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("caption") caption: string,
    @Ctx() { prisma, req }: Context
  ): Promise<PostResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NOT_AUTHENTICATED,
          },
        ],
      };
    }

    const foundPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    if (!foundPost) {
      return {
        errors: [
          {
            field: "id",
            message: NOT_FOUND("post"),
          },
        ],
      };
    }

    if (foundPost.authorId !== req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NOT_AUTHENTICATED,
          },
        ],
      };
    }

    // don't need a try catch here as we have already checked for the only possible prisma error (not found)
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        caption: caption,
      },
    });
    return {
      post,
    };
  }

  @Mutation(() => PostResponse)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, req }: Context
  ): Promise<PostResponse> | null {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NOT_AUTHENTICATED,
          },
        ],
      };
    }

    const foundPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    if (!foundPost) {
      return {
        errors: [
          {
            field: "id",
            message: NOT_FOUND("post"),
          },
        ],
      };
    }

    if (foundPost.authorId !== req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NOT_AUTHENTICATED,
          },
        ],
      };
    }

    const post = await prisma.post.delete({
      where: {
        id: id,
      },
    });
    return {
      post,
    };
  }
}
