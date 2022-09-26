import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "./strategy";
import { Injectable } from "@nestjs/common";
import { UserModel } from "../../models/user";

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy as any, "vk") {
  constructor() {
    super({
      clientID: process.env.VK_APP_ID,
      clientSecret: process.env.VK_SECRET_KEY,
      callbackURL: process.env.VK_REDIRECT,
    });
  }

  async validate(req, accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { name, id } = profile;

    const user: UserModel = {
      externalId: id,
      firstName: name.givenName,
      lastName: name.familyName,
      displayName: profile?.displayName,
    };

    done(null, user);
  }

  authenticate(req, options) {
    const state: any = { redirect_url: req.query.redirect_url };

    super.authenticate(req, Object.assign(options, { state: JSON.stringify(state) }));
  }
}
