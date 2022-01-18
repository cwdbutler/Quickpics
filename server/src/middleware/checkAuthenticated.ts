import { MiddlewareFn } from "type-graphql";
import { Context } from "../context";

export const checkAuthenticated: MiddlewareFn<Context> = (
  { context },
  next
) => {
  if (!context.req.session.userId) {
    throw new Error("Not authenticated");
  }

  return next();
};
