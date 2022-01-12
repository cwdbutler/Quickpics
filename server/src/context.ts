import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
});

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma: prisma,
};
