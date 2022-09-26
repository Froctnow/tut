import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = GqlExecutionContext.create(context);

    const { req } = request.getContext<{ req: Request }>();

    let jwt: string = req.cookies.np_token;

    if (!jwt) {
      jwt = req.signedCookies.np_token;

      if (!jwt) return false;
    }

    try {
      verify(jwt, process.env.JWT_PRIVATE_KEY);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
