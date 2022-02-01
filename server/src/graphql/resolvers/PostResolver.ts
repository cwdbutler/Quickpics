import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../types/Post";
import { Context } from "../../context";
import { CreatePostResponse } from "../types/CreatePostResponse";
import {
  MAX_TAKE,
  MAX_TEXT_FIELD_LENGTH,
  NOT_FOUND,
  NO_PERMISSION,
  TEXT_TOO_LONG,
} from "../../utils/constants";
import { createId } from "../../utils/createId";
import { checkAuthenticated } from "../../middleware/checkAuthenticated";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { uploadFile } from "../../utils/uploadFile";
import { deleteImage } from "../../utils/deleteImage";
import { PostsResponse } from "../types/PostsResponse";
import { Like } from "../types/Like";
import { Comment } from "../types/Comment";

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => [Like])
  async likes(@Root() post: Post, @Ctx() { prisma }: Context): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: {
        entityId: post.id,
      },
      include: {
        author: true,
      },
    });
    return likes;
  }

  @FieldResolver(() => Int)
  async likeCount(
    @Root() post: Post,
    @Ctx() { prisma }: Context
  ): Promise<number> {
    // could have combined this with the like resolver but it was too cluttered (would have to do likes.likes)
    const likes = await prisma.like.findMany({
      where: {
        entityId: post.id,
      },
    });

    return likes.length;
  }

  @FieldResolver(() => Boolean)
  async liked(
    @Root() post: Post,
    @Ctx() { prisma, req }: Context
  ): Promise<boolean> {
    if (!req.session.userId) {
      return false;
    }

    const [liked] = await prisma.like.findMany({
      where: {
        AND: [
          { entityId: { equals: post.id } },
          { authorId: { equals: req.session.userId } },
        ],
      },
    });

    return liked ? true : false;
  }

  @FieldResolver(() => [Comment])
  async commentsPreview(
    @Root() post: Post,
    @Ctx() { prisma, req }: Context
  ): Promise<Comment[]> {
    return post.comments.slice(0, 2); // return the first 2 comments
  }

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
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
        },
      },
    });
  }

  @Query(() => PostsResponse)
  async allPosts(
    @Ctx() { prisma }: Context,
    @Arg("take", () => Int) take: number,
    @Arg("cursor", { nullable: true }) cursor: string
  ): Promise<PostsResponse> {
    const cappedTake = Math.min(take, MAX_TAKE);
    const takePlusOne = cappedTake + 1;
    // cap the take, and + 1 to check if there is more

    let posts: Post[];
    if (cursor) {
      posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        cursor: {
          id: cursor,
        },
        take: takePlusOne,
        skip: 1, // skips the cursor
        include: {
          author: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
            },
          },
        },
      });
    } else {
      posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: takePlusOne,
        include: {
          author: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
            },
          },
        },
      });
    }

    return {
      posts: posts.slice(0, cappedTake),
      // return the original requested amount
      hasMore: posts.length === takePlusOne,
      // check if there is still one more post
    };
  }

  @Mutation(() => CreatePostResponse)
  @UseMiddleware(checkAuthenticated)
  async createPost(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Arg("caption") caption: string,
    @Ctx() { prisma, req }: Context
  ): Promise<CreatePostResponse> {
    if (caption.length > MAX_TEXT_FIELD_LENGTH) {
      return {
        errors: [
          {
            field: "caption",
            message: TEXT_TOO_LONG,
          },
        ],
      };
    }

    const postId = createId();
    const result = await uploadFile(file, postId);
    // postId is s3 bucket key

    const [post] = await prisma.$transaction([
      prisma.post.create({
        data: {
          id: postId,
          caption: caption,
          imageUrl: result.Location,
          author: {
            connect: {
              id: req.session.userId,
            },
          },
        },
        include: {
          author: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
            },
          },
        },
      }),
      prisma.activity.create({
        data: { id: postId, model: "post", userId: req.session.userId },
      }),
    ]);

    return {
      post,
    };
  }

  @Mutation(() => CreatePostResponse)
  @UseMiddleware(checkAuthenticated)
  async updatePost(
    @Arg("id", () => String) id: string,
    @Arg("caption") caption: string,
    @Ctx() { prisma, req }: Context
  ): Promise<CreatePostResponse> {
    if (caption.length > MAX_TEXT_FIELD_LENGTH) {
      return {
        errors: [
          {
            field: "caption",
            message: TEXT_TOO_LONG,
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
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
        },
      },
    });
    return {
      post,
    };
  }

  @Mutation(() => CreatePostResponse)
  @UseMiddleware(checkAuthenticated)
  async deletePost(
    @Arg("id", () => String) id: string,
    @Ctx() { prisma, req }: Context
  ): Promise<CreatePostResponse> | null {
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
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
        },
      },
    });

    await deleteImage(post.id);
    // delete from s3

    return {
      post,
    };
  }
}
