import { Ctx, Query, Resolver } from "type-graphql";
import { Post } from "./Post";
import { Context } from "../context";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: Context) {
    return ctx.prisma.post.findMany();
  }
}
