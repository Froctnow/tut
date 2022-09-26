import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import LocationCheckEntity from "src/database/entities/LocationCheck";
import { ESModule } from "src/elastic_search/ES.module";
import { LocationCheckResolver } from "./location.check.resolvers";
import { LocationCheckService } from "./location.check.service";

@Module({
  imports: [TypeOrmModule.forFeature([LocationCheckEntity]), ESModule],
  providers: [LocationCheckService, LocationCheckResolver],
  exports: [LocationCheckService],
})
export class LocationCheckModule {}
