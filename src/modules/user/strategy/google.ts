import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UserModel } from "../models/user";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, id } = profile;

    const user: UserModel = {
      externalId: id,
      email: emails[0].value,
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
