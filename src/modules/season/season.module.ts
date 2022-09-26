import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import SeasonEntity from "src/database/entities/Season";
import { ImageModule } from "../image/image.module";
import { SeasonResolver } from "./season.resolvers";
import { SeasonService } from "./season.service";

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity]), ImageModule],
  providers: [SeasonResolver, SeasonService],
  exports: [TypeOrmModule.forFeature([SeasonEntity]), SeasonService],
})
export class SeasonModule {}
