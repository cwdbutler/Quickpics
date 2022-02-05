import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Context } from "../../context";
import {
  MAX_TEXT_FIELD_LENGTH,
  NOT_FOUND,
  NO_PERMISSION,
  TEXT_TOO_LONG,
} from "../../utils/constants";
import { createId } from "../../utils/createId";
import { checkAuthenticated } from "../../middleware/checkAuthenticated";
import { Like } from "../types/Like";
import { Comment } from "../types/Comment";
import { CreateCommentResponse } from "../types/CreateCommentResponse";

@Resolver(Comment)
export class CommentResolver {
  // field resolvers are same as Post
  @FieldResolver(() => [Like])
  async likes(
    @Root() comment: Comment,
    @Ctx() { prisma }: Context
  ): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: {
        entityId: comment.id,
      },
      include: {
        author: true,
      },
    });
    return likes;
  }

  @FieldResolver(() => Int)
  async likeCount(
    @Root() comment: Comment,
    @Ctx() { prisma }: Context
  ): Promise<number> {
    const likes = await prisma.like.findMany({
      where: {
        entityId: comment.id,
      },
    });

    return likes.length;
  }

  @FieldResolver(() => Boolean)
  async liked(
    @Root() comment: Comment,
    @Ctx() { prisma, req }: Context
  ): Promise<boolean> {
    if (!req.session.userId) {
      return false;
    }

    const [liked] = await prisma.like.findMany({
      where: {
        AND: [
          { entityId: { equals: comment.id } },
          { authorId: { equals: req.session.userId } },
        ],
      },
    });

    return liked ? true : false;
  }

  @Mutation(() => CreateCommentResponse)
  @UseMiddleware(checkAuthenticated)
  async createComment(
    @Arg("postId") postId: string,
    @Arg("text") text: string,
    @Ctx() { prisma, req }: Context
  ): Promise<CreateCommentResponse> {
    if (text.length > MAX_TEXT_FIELD_LENGTH) {
      return {
        errors: [
          {
            field: "text",
            message: TEXT_TOO_LONG,
          },
        ],
      };
    }

    const commentId = createId();

    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          id: commentId,
          text: text,
          post: {
            connect: {
              id: postId,
            },
          },
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
      prisma.activity.create({
        data: { id: commentId, model: "comment", userId: req.session.userId },
      }),
    ]);

    return {
      comment,
    };
  }

  @Mutation(() => CreateCommentResponse)
  @UseMiddleware(checkAuthenticated)
  async updateComment(
    @Arg("id", () => String) id: string,
    @Arg("text") text: string,
    @Ctx() { prisma, req }: Context
  ): Promise<CreateCommentResponse> {
    if (text.length > MAX_TEXT_FIELD_LENGTH) {
      return {
        errors: [
          {
            field: "text",
            message: TEXT_TOO_LONG,
          },
        ],
      };
    }

    const foundcomment = await prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    if (!foundcomment) {
      return {
        errors: [
          {
            field: "id",
            message: NOT_FOUND("comment"),
          },
        ],
      };
    }

    if (foundcomment.authorId !== req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NO_PERMISSION,
          },
        ],
      };
    }

    const comment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        text: text,
      },
      include: {
        author: true,
      },
    });
    return {
      comment,
    };
  }

  @Mutation(() => CreateCommentResponse)
  @UseMiddleware(checkAuthenticated)
  async deleteComment(
    @Arg("id", () => String) id: string,
    @Ctx() { prisma, req }: Context
  ): Promise<CreateCommentResponse> | null {
    const foundcomment = await prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    if (!foundcomment) {
      return {
        errors: [
          {
            field: "id",
            message: NOT_FOUND("comment"),
          },
        ],
      };
    }

    if (foundcomment.authorId !== req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: NO_PERMISSION,
          },
        ],
      };
    }

    const comment = await prisma.comment.delete({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    await prisma.like.deleteMany({
      where: {
        entityId: id,
      },
    });

    await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    return {
      comment,
    };
  }
}
