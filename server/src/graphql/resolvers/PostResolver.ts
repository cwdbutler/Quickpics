import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../types/Post";
import { Context } from "../../context";
import { PostResponse } from "../types/PostResponse";
import { NOT_FOUND, NO_PERMISSION } from "../../utils/constants";
import { createId } from "../../utils/createId";
import { checkAuthenticated } from "../../middleware/checkAuthenticated";

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
  @UseMiddleware(checkAuthenticated)
  async createPost(
    @Arg("caption") caption: string,
    @Ctx() { prisma, req }: Context
  ): Promise<PostResponse> {
    const postId = createId();

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
  @UseMiddleware(checkAuthenticated)
  async updatePost(
    @Arg("id", () => String) id: string,
    @Arg("caption") caption: string,
    @Ctx() { prisma, req }: Context
  ): Promise<PostResponse> {
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
            message: NO_PERMISSION,
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
  @UseMiddleware(checkAuthenticated)
  async deletePost(
    @Arg("id", () => String) id: string,
    @Ctx() { prisma, req }: Context
  ): Promise<PostResponse> | null {
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
            message: NO_PERMISSION,
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
