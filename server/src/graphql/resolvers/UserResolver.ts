import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../types/User";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import { CreateUserResponse } from "../types/CreateUserResponse";
import {
  BAD_CREDENTIALS,
  COOKIE_NAME,
  MAX_FIELD_LENGTH,
  MIN_FIELD_LENGTH,
  NOT_UNIQUE,
  TOO_LONG,
  TOO_SHORT,
} from "../../utils/constants";
import { checkNotAuthenticated } from "../../middleware/checkNotAuhenticated";

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

  @Mutation(() => CreateUserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { prisma, req }
  ): Promise<CreateUserResponse> {
    if (username.length < 1) {
      return {
        errors: [
          {
            field: "username",
            message: TOO_SHORT("username"),
          },
        ],
      };
    }

    if (username.length > MAX_FIELD_LENGTH) {
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

    // i don't just create the user and catch the errors here because it won't be case insensitive
    const existingEmail = await prisma.user.count({
      where: {
        email: {
          contains: email,
          mode: "insensitive",
        },
        // Prisma workaround
      },
    });
    if (existingEmail > 0) {
      return {
        errors: [
          {
            field: "email",
            message: NOT_UNIQUE("email"),
          },
        ],
      };
    }

    const existingUsername = await prisma.user.count({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
        // Prisma workaround
      },
    });
    if (existingUsername > 0) {
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
        email: email,
        username: username,
        passwordHash: hashed,
      },
    });

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => CreateUserResponse)
  @UseMiddleware(checkNotAuthenticated)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { prisma, req }
  ): Promise<CreateUserResponse> {
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
      // no idea how to test this
    });
    res.clearCookie(COOKIE_NAME);
    return true;
  }
}
