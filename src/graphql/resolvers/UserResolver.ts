import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../types/User";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import { UserResponse } from "../types/UserResponse";
import { formatError } from "./formatError";

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

  @Mutation(() => UserResponse)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { prisma }: Context
  ): Promise<UserResponse> {
    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username: username,
          passwordHash: hashed,
        },
      });
      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: "username",
            message: formatError(error),
          },
        ],
      };
    }
  }
}
