import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { deleteFile } from "./utils/deleteFile";
import { uploadFile } from "./utils/uploadFile";
// typing what can be passed into the server as context

export interface Context {
  prisma?: PrismaClient;
  req?: Request;
  res?: Response;
  uploadFile?: typeof uploadFile;
  deleteFile?: typeof deleteFile;
}
