import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { decode } from "jsonwebtoken";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roleList = this.reflector.get<string[]>("roles", context.getHandler());

    if (!roleList) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const jwt: string | { [key: string]: any } = decode(request.cookies.np_token);

    return (jwt as any).roleList.some(el => roleList.some(role => el === role));
  }
}
