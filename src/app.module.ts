import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { PassportModule } from "@nestjs/passport";
import { DatabaseModule } from "./database/database.module";
import { ESModule } from "./elastic_search/ES.module";
import { MailModule } from "./mail/mail.module";
import { ActivityModule } from "./modules/activity/activity.module";
import { CategoryModule } from "./modules/category/category.module";
import { LocationModule } from "./modules/location/location.module";
import { SeasonModule } from "./modules/season/season.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({ autoSchemaFile: true, uploads: false }),
    LocationModule,
    UserModule,
    PassportModule,
    ESModule,
    ActivityModule,
    CategoryModule,
    SeasonModule,
  ],
  controllers: [],
})
export class AppModule {
  public static register(params) {
    return {
      module: AppModule,
      imports: [DatabaseModule.register(params), MailModule.register(params)],
    };
  }
}
