import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UserModel } from "./models/user";
import { Void } from "src/graphql/scalar.void";
import { Roles } from "src/enums/roles";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EnvList } from "src/enums/env";

@Resolver("Auth")
export class UserResolver {
  constructor(private userService: UserService, private mailerService: MailerService, private configService: ConfigService) {}

  @Mutation(() => Void, { nullable: true })
  async register(@Args({ name: "user", type: () => UserModel }) user: UserModel): Promise<void> {
    let userId: string;

    try {
      const { user: newUser } = await this.userService.create(user, [Roles.USER]);

      userId = newUser.id;

      const token = await this.userService.generateVerifyToken(userId);
      const host = this.configService.get<string>(EnvList.APP_HOST);
      const port = this.configService.get<string>(EnvList.APP_PORT);
      const mode = this.configService.get<string>(EnvList.APP_MODE);

      await this.mailerService.sendMail({
        to: newUser.email,
        subject: "Подтверждение регистрации",
        template: "./register",
        context: {
          url: `http://${host}${mode === "dev" ? `:${port}` : ""}/api/user/auth/register/verify?verifyToken=${token}`,
          username: `${newUser.firstName} ${newUser.lastName}`,
        },
      });
    } catch (error) {
      if (userId) await this.userService.deleteUser(userId);
      throw error;
    }
  }
}
