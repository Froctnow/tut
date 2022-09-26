import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({})
export class MailModule {
  public static register(params) {
    return {
      module: MailModule,
      global: true,
      imports: [
        MailerModule.forRoot({
          transport: {
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.EMAIL_FROM,
              pass: process.env.EMAIL_PASSWORD,
            },
          },
          defaults: { from: params.env.EMAIL_FROM },
          template: {
            dir: __dirname + "/templates",
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        }),
      ],
    };
  }
}
