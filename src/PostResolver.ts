import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "./Post";
import { Context } from "./context";

@Resolver()
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number, @Ctx() { prisma }: Context) {
    return prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Post])
  posts(@Ctx() { prisma }: Context) {
    return prisma.post.findMany();
  }

  @Mutation(() => Post)
  createPost(@Arg("caption") caption: string, @Ctx() { prisma }: Context) {
    return prisma.post.create({
      data: {
        caption: caption,
      },
    });
  }
}
