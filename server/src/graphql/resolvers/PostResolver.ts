import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../types/Post";
import { Context } from "../../context";
import { PostResponse } from "../types/PostResponse";
import {
  NOT_AUTHENTICATED,
  NOT_FOUND,
  NOT_LOGGED_IN,
} from "../../utils/constants";
import { nanoid } from "../../utils/generateNanoId";

@Resolver()
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => String) id: string,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });
  }

  @Query(() => [Post])
  allPosts(@Ctx() { prisma }: Context): Promise<Post[]> {
    return prisma.post.findMany({
      include: {
        author: true,
      },
    });
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

    const postId = nanoid();

    const [post] = await prisma.$transaction([
      prisma.post.create({
        data: {
          id: postId,
          caption: caption,
          author: {
            connect: {
              id: req.session.userId,
            },
          },
        },
        include: {
          author: true,
        },
      }),
      prisma.activity.create({ data: { id: postId, model: "post" } }),
    ]);

    return {
      post,
    };
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("id", () => String) id: string,
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
      include: {
        author: true,
      },
    });
    return {
      post,
    };
  }

  @Mutation(() => PostResponse)
  async deletePost(
    @Arg("id", () => String) id: string,
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
      include: {
        author: true,
      },
    });
    return {
      post,
    };
  }
}
