import { checkAuthenticated } from "../../middleware/checkAuthenticated";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Context } from "../../context";

@Resolver()
export class PostResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(checkAuthenticated)
  async like(
    @Arg("entityId") entityId: string,
    @Ctx() { prisma, req }: Context
  ) {
    // check if the entity exists
    const entity = await prisma.activity.findUnique({
      where: {
        id: entityId,
      },
    });

    if (!entity) {
      return false;
    }

    // check if liked by this user already
    const [alreadyLiked] = await prisma.like.findMany({
      where: {
        AND: [
          { entityId: { equals: entityId } },
          { authorId: { equals: req.session.userId } },
        ],
      },
    });

    if (alreadyLiked) {
      return false;
    }

    // create a like in Like table
    const like = await prisma.like.create({
      data: {
        entityId: entityId,
        model: entity.model,
        author: {
          connect: {
            id: req.session.userId,
          },
        },
      },
    });

    return like ? true : false;
  }
}
