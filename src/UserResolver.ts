import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./User";
import { Context } from "./context";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  user(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  // @Mutation(() => User)
  // createPost(
  //   @Arg("username") username: string,
  //   @Arg("password") password: string,
  //   @Ctx() { prisma }: Context
  // ): Promise<User> {
  //   return prisma.user.create({
  //     data: {
  //       username: username,
  //       passwordDigest:?
  //     },
  //   });
  // }
}
