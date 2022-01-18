import { Ctx, Query, Resolver } from "type-graphql";
import { ActivityUnion } from "../types/Activity";
import { Context } from "../../context";

@Resolver()
export class ActivityResolver {
  @Query(() => [ActivityUnion])
  async feed(@Ctx() { prisma, req }: Context) {
    const activities = await prisma.activity.findMany({});
    // can filter by user in the future:
    // where: {
    //   userId: req.session.userId, // or id in list of followers
    // },

    // map over the activity and return the object from its relevant model
    const feed = await Promise.all(
      activities.map((activity) => {
        return prisma[activity.model].findUnique({
          where: { id: activity.id },
          include: {
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        });
      })
    );

    return feed;
  }
}
