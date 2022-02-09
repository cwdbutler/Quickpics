import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { User } from "../types/User";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import { CreateUserResponse } from "../types/CreateUserResponse";
import {
  ALPHANUMERIC_USERNAME,
  BAD_CREDENTIALS,
  COOKIE_NAME,
  MAX_USERNAME_LENGTH,
  MIN_FIELD_LENGTH,
  NOT_UNIQUE,
  USERNAME_TOO_LONG,
  TOO_SHORT,
  FORBIDDEN_USERNAME,
  FORBIDDEN_USERNAMES,
} from "../../utils/constants";
import { checkNotAuthenticated } from "../../middleware/checkNotAuhenticated";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { checkAuthenticated } from "../../middleware/checkAuthenticated";
import { uploadFile } from "../../utils/uploadFile";
import { deleteImage } from "../..//utils/deleteImage";
import { createId } from "../../utils/createId";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context) {
    // users can only see their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @FieldResolver(() => Int)
  async postCount(
    @Root() user: User,
    @Ctx() { prisma }: Context
  ): Promise<number> {
    // could have combined this with the like resolver but it was too cluttered (would have to do likes.likes)
    const postAggregation = await prisma.post.aggregate({
      where: {
        authorId: user.id,
      },
      _count: true,
    });

    return postAggregation._count;
  }

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
    @Arg("id", () => Int, { nullable: true }) id: number,
    @Arg("username", { nullable: true }) username: string,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    if (!id && !username) {
      throw new Error("You must specify an id or username.");
    }
    return prisma.user.findUnique({
      where: {
        id: id || undefined,
        username: username || undefined,
      },
    });
  }

  @Query(() => [User], { nullable: true })
  async suggestedUsers(@Ctx() { prisma }: Context): Promise<User[]> {
    // returns the 5 users with the most posts
    const usersWithCount = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: 6,
    });

    return usersWithCount;
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

    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return {
        errors: [
          {
            field: "username",
            message: ALPHANUMERIC_USERNAME,
          },
        ],
      };
    }

    if (FORBIDDEN_USERNAMES.includes(username)) {
      return {
        errors: [
          {
            field: "username",
            message: FORBIDDEN_USERNAME,
          },
        ],
      };
    }

    if (username.length > MAX_USERNAME_LENGTH) {
      return {
        errors: [
          {
            field: "username",
            message: USERNAME_TOO_LONG,
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
    @Arg("emailOrUsername") emailOrUsername: string,
    @Arg("password") password: string,
    @Ctx() { prisma, req }
  ): Promise<CreateUserResponse> {
    // this works because emails are validated as valid emails, and usernames are validated as alphanumeric
    // it should be impossible to match a username with an email or vice versa
    // they are also both unique, so findMany shouldn't be an issue
    const [user] = await prisma.user.findMany({
      where: {
        OR: [
          { email: { equals: emailOrUsername, mode: "insensitive" } },
          { username: { equals: emailOrUsername, mode: "insensitive" } },
        ],
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

  @Mutation(() => User)
  @UseMiddleware(checkAuthenticated)
  async updateProfilePic(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Ctx() { req, prisma }: Context
  ): Promise<User> {
    const { avatarUrl } = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
      select: {
        avatarUrl: true,
      },
    });

    // delete the old image from s3
    if (avatarUrl) {
      const [key] = avatarUrl.match(/([^\/]+)(?=\.\w+$)/);
      // gets the key from the S3 url
      await deleteImage(key);
      // delete from s3
    }

    const result = await uploadFile(file, createId());
    // unique key each time for easier updates in front end

    const user = await prisma.user.update({
      where: {
        id: req.session.userId,
      },
      data: {
        avatarUrl: result.Location,
      },
    });

    return user;
  }

  @Mutation(() => User)
  @UseMiddleware(checkAuthenticated)
  async removeProfilePic(@Ctx() { req, prisma }: Context): Promise<User> {
    const { avatarUrl } = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
      select: {
        avatarUrl: true,
      },
    });

    if (avatarUrl) {
      const [key] = avatarUrl.match(/([^\/]+)(?=\.\w+$)/);
      await deleteImage(key);
    }

    const user = await prisma.user.update({
      where: {
        id: req.session.userId,
      },
      data: {
        avatarUrl: null,
      },
    });

    return user;
  }
}
