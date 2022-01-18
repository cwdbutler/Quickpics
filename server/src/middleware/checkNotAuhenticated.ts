import { MiddlewareFn } from "type-graphql";
import { Context } from "../context";

export const checkNotAuthenticated: MiddlewareFn<Context> = (
  { context },
  next
) => {
  if (context.req.session.userId) {
    throw new Error("Already authenticated");
  }

  return next();
};
