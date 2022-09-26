/**
 * Module dependencies.
 */
import util from "util";
import OAuth2Strategy, { InternalOAuthError } from "passport-oauth2";

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || "https://oauth.vk.com/authorize";
  options.tokenURL = options.tokenURL || "https://oauth.vk.com/access_token";
  options.scopeSeparator = options.scopeSeparator || ",";
  options.passReqToCallback = true;
  this.lang = options.lang || "en";
  this.photoSize = options.photoSize || 200;

  // since options.lang have nothing to do with OAuth2Strategy
  delete options.lang;
  delete options.photoSize;

  OAuth2Strategy.call(this, options, verify);
  this.name = "vkontakte";
  this._profileURL = options.profileURL || "https://api.vk.com/method/users.get";
  this._profileFields = options.profileFields || [];
  this._apiVersion = options.apiVersion || "5.110";
}

function parse(json) {
  if (typeof json === "string") {
    json = JSON.parse(json);
  }

  const profile = {
    id: json.id,
    username: json.screen_name,
    displayName: json.first_name + " " + json.last_name,
    name: {
      familyName: json.last_name,
      givenName: json.first_name,
      middleName: null,
    },
    gender: null,
    profileUrl: null,
    photos: [],
    city: null,
    birthday: null,
    provider: null,
    _raw: null,
    _json: null,
  };

  if (json.nickname) {
    profile.name.middleName = json.nickname;
  }

  if (json.sex) {
    profile.gender = json.sex === 1 ? "female" : "male";
  }

  var { sex } = json;

  profile.gender = sex === 1 ? "female" : sex === 2 ? "male" : void 1;
  profile.profileUrl = "http://vk.com/" + json.screen_name;
  profile.photos = [];

  for (var key in json) {
    if (key.indexOf("photo") !== 0) continue;
    profile.photos.push({
      value: json[key],
      type: key,
    });
  }

  if (json.city) {
    profile.city = json.city.title;
  }

  var bdate = /^(\d+)\.(\d+)\.(\d+)$/.exec(json.bdate);

  if (bdate) {
    // eslint-disable-next-line prefer-destructuring
    const year = bdate[3];
    const month = (bdate[2].length < 2 ? "0" : "") + bdate[2];
    const day = (bdate[1].length < 2 ? "0" : "") + bdate[1];

    profile.birthday = year + "-" + month + "-" + day;
  }

  return profile;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authorizationParams = function (options) {
  const params: { layout?: any } = {};

  if (options.layout) {
    params.layout = options.layout;
  }

  return params;
};

Strategy.prototype.userProfile = function (accessToken, done) {
  let url = this._profileURL;

  const fields = ["uid", "first_name", "last_name", "screen_name", "sex", "photo_" + this.photoSize];

  this._profileFields.forEach(f => {
    if (fields.indexOf(f) < 0) fields.push(f);
  });

  url += "?fields=" + fields.join(",") + "&v=" + this._apiVersion + "&https=1";

  if (this.lang) url += "&lang=" + this.lang;

  this._oauth2.getProtectedResource(url, accessToken, (err, body, res) => {
    if (err) {
      return done(new InternalOAuthError("failed to fetch user profile", err));
    }

    try {
      let json = JSON.parse(body);

      if (json.error) throw new Error(`${json.error.error_msg}. Code:${json.error.error_code}`);

      [json] = json.response;

      var profile = parse(json);

      profile.provider = "vkontakte";
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch (e) {
      done(e);
    }
  });
};

/**
 * Expose `Strategy`.
 */
export { Strategy };
