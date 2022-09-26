import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserEntity from "src/database/entities/User";
import RoleEntity from "src/database/entities/Role";
import { GoogleStrategy } from "./strategy/google";
import { ConfigModule } from "@nestjs/config";
import { OkStrategy } from "./strategy/ok";
import { VkStrategy } from "./strategy/vk";
import { MailModule } from "src/mail/mail.module";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), ConfigModule, MailModule],
  providers: [UserService, GoogleStrategy, OkStrategy, VkStrategy, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
