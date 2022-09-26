import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ESService } from "./ES.service";

@Module({
  imports: [ConfigModule],
  providers: [ESService],
  exports: [ESService],
})
export class ESModule {}
