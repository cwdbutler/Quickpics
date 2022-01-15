import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const prisma = new PrismaClient({
  log: ["query"],
});

// typing what can be passed into the server as context

export interface Context {
  prisma?: PrismaClient;
  req?: Request;
  res?: Response;
}
