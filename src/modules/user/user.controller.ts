import { Body, Controller, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { EnvList } from "src/enums/env";
import { Roles } from "src/enums/roles";
import { CredentialsDto } from "./dto/credentials";
import { UserService } from "./user.service";

@Controller("api/user")
export class UserController {
  private host: string;

  constructor(private userService: UserService, private configService: ConfigService) {
    this.host = configService.get<string>(EnvList.APP_HOST);
  }

  @Post("auth")
  async auth(@Body() credenstialsDto: CredentialsDto, @Res() res: Response): Promise<void> {
    const { jwt } = await this.userService.authPassword({ password: credenstialsDto.password, email: credenstialsDto.email });

    res.cookie("np_token", jwt, { signed: true });
    res.send();
  }

  @Get("/auth/google")
  @UseGuards(AuthGuard("google"))
  public authGoogle(@Req() req) {}

  @Get("/auth/redirect/google")
  @UseGuards(AuthGuard("google"))
  @Redirect()
  public async authRedirectGoogle(@Req() req, @Res() res: Response) {
    const { jwt } = await this.userService.regSocialNetwork(req.user, [Roles.USER]);

    res.cookie("np_token", jwt, { signed: true });
    return { url: JSON.parse(req.query.state).redirect_url };
  }

  @Get("/auth/token/:email")
  public getToken(@Param("email") email: string) {
    const mode = this.configService.get<string>(EnvList.APP_MODE);

    if (mode !== "dev") return;

    return this.userService.getToken(email);
  }

  @Get("/auth/ok")
  @UseGuards(AuthGuard("odnoklassniki"))
  public authOk(@Req() req) {}

  @Get("/auth/redirect/ok")
  @UseGuards(AuthGuard("odnoklassniki"))
  @Redirect()
  public async authRedirectOk(@Req() req, @Res() res: Response) {
    const { jwt } = await this.userService.regSocialNetwork(req.user, [Roles.USER]);

    res.cookie("np_token", jwt, { signed: true });
    return { url: JSON.parse(req.query.state).redirect_url };
  }

  @Get("/auth/vk")
  @UseGuards(AuthGuard("vk"))
  public authVk(@Req() req) {}

  @Get("/auth/redirect/vk")
  @UseGuards(AuthGuard("vk"))
  @Redirect()
  public async authRedirectVk(@Req() req, @Res() res: Response) {
    const { jwt } = await this.userService.regSocialNetwork(req.user, [Roles.USER]);

    res.cookie("np_token", jwt, { signed: true });
    return { url: JSON.parse(req.query.state).redirect_url };
  }

  @Get("auth/register/verify")
  @Redirect()
  public async registerVerify(@Query("verifyToken") verifyToken: string, @Res() res: Response) {
    const { jwt } = await this.userService.registerVerify(verifyToken);

    res.cookie("np_token", jwt, { signed: true });
    return { url: `http://${this.host}` };
  }
}
