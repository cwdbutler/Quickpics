import { Ctx, Query, Resolver } from "type-graphql";
import { Post } from "./Post";
import { Context } from "./context";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { prisma }: Context) {
    return prisma.post.findMany();
  }
}
