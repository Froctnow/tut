import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-odnoklassniki";
import { Injectable } from "@nestjs/common";
import { UserModel } from "../models/user";

@Injectable()
export class OkStrategy extends PassportStrategy(Strategy, "odnoklassniki") {
  constructor() {
    super({
      clientID: process.env.OK_APP_ID,
      clientSecret: process.env.OK_SECRET_KEY,
      callbackURL: process.env.OK_REDIRECT,
      clientPublic: process.env.OK_PUBLIC_KEY,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { name, emails, id } = profile;

    const user: UserModel = {
      externalId: id,
      email: emails.length ? emails[0].value : null,
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
