import { Ctx, Query, Resolver } from "type-graphql";
import { ActivityUnion } from "../types/Activity";
import { Context } from "../../context";

@Resolver()
export class ActivityResolver {
  @Query(() => [ActivityUnion])
  async feed(@Ctx() { prisma }: Context) {
    const activities = await prisma.activity.findMany({});
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

    // const myFeed = feed.filter((item) => {
    //   return item.author.id == req.session.userId;
    // });
    // terribly inefficient, but might be the only way

    return feed;
  }
}
