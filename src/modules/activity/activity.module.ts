import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ActivityEntity from "src/database/entities/Activity";
import { ImageModule } from "../image/image.module";
import { ActivityResolver } from "./activity.resolvers";
import { ActivityService } from "./activity.service";

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity]), ImageModule],
  providers: [ActivityResolver, ActivityService],
  exports: [TypeOrmModule.forFeature([ActivityEntity]), ActivityService],
})
export class ActivityModule {}
