import { Prisma } from "@prisma/client";
import { NOT_FOUND, NOT_UNIQUE, TOO_LONG } from "./constants";

export function formatPrismaError(error: Error, entity?: string): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let prismaError = error as any;
    if (error.code === "P2002") {
      return NOT_UNIQUE(prismaError.meta.target);
    }
    if (prismaError.code === "P2025") {
      return NOT_FOUND(entity);
    }
  }

  // if it's not a known Prisma error, then it's a serious one that should be thrown
  throw error;
}

// to be improved so that it returns an array of field errors
