import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../types/User";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import { UserResponse } from "../types/UserResponse";
import { formatPrismaError } from "../../utils/formatPrismaError";
import {
  BAD_CREDENTIALS,
  COOKIE_NAME,
  MAX_USERNAME_LENGTH,
  MIN_FIELD_LENGTH,
  NOT_UNIQUE,
  TOO_LONG,
  TOO_SHORT,
} from "../../utils/constants";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req, prisma }: Context) {
    if (!req.session.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    return user;
  }

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
    @Ctx() { prisma, req }
  ): Promise<UserResponse> {
    if (username.length < MIN_FIELD_LENGTH) {
      return {
        errors: [
          {
            field: "username",
            message: TOO_SHORT("username"),
          },
        ],
      };
    }

    if (username.length > MAX_USERNAME_LENGTH) {
      return {
        errors: [
          {
            field: "username",
            message: TOO_LONG("username"),
          },
        ],
      };
    }

    if (password.length < MIN_FIELD_LENGTH) {
      return {
        errors: [
          {
            field: "password",
            message: TOO_SHORT("password"),
          },
        ],
      };
    }

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

      req.session.userId = user.id;

      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: "username",
            message: formatPrismaError(error),
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { prisma, req }
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

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return false;
      }
    });
    res.clearCookie(COOKIE_NAME);
    return true;
  }
}
