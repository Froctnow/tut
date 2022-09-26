import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { verify } from "jsonwebtoken";

@Injectable()
export class GqlAuthGuard extends AuthGuard() {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const jwt: string = ctx.getContext().req.cookies.np_token;

    if (!jwt) return false;

    try {
      verify(jwt, process.env.JWT_PRIVATE_KEY);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
