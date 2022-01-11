import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../types/User";
import { Context } from "../../context";
import bcrypt from "bcrypt";

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

  @Mutation(() => User, { nullable: true })
  async createUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    let hashed = await bcrypt.hash(password, 10);
    let user: User | null;
    try {
      user = await prisma.user.create({
        data: {
          username: username,
          passwordHash: hashed,
        },
      });
    } catch (error) {
      user = null;
    }
    return user;
  }
}
