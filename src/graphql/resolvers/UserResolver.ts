import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../types/User";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import { UserResponse } from "../types/UserResponse";
import { formatError } from "./formatError";
import { BAD_CREDENTIALS, NOT_FOUND, NOT_UNIQUE } from "../constants";

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
      const existingUser = await prisma.user.count({
        where: {
          username: {
            contains: username,
            mode: "insensitive",
          },
        },
      });
      if (existingUser > 0) {
        return {
          errors: [
            {
              field: "username",
              message: NOT_UNIQUE("username"),
            },
          ],
        };
      }

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

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { prisma }: Context
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: BAD_CREDENTIALS("username"),
          },
        ],
      };
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: BAD_CREDENTIALS("password"),
          },
        ],
      };
    }

    return {
      user,
    };
  }
}
