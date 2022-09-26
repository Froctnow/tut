import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { decode } from "jsonwebtoken";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  const jwt = ctx.getContext<{ req: Request }>().req.signedCookies.np_token;

  if (!jwt) return null;

  return decode(jwt);
});
