import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import LocationEntity from "src/database/entities/Location";
import { HashtagModule } from "../hashtag/hashtag.module";
import { ImageModule } from "../image/image.module";
import { LocationsResolver } from "./location.resolvers";
import { LocationService } from "./location.service";
import { ReviewModule } from "./modules/review/review.module";
import { ESModule } from "src/elastic_search/ES.module";
import CategoryEntity from "src/database/entities/Category";
import ReviewEntity from "src/database/entities/Review";
import ActivityEntity from "src/database/entities/Activity";
import { LocationCheckModule } from "./modules/location_check/location.check.module";
import { UserModule } from "../user/user.module";
import UserEntity from "src/database/entities/User";
import SeasonEntity from "src/database/entities/Season";

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity, CategoryEntity, ReviewEntity, ActivityEntity, UserEntity, SeasonEntity]),
    ImageModule,
    HashtagModule,
    ReviewModule,
    LocationCheckModule,
    UserModule,
    ESModule,
  ],
  providers: [LocationsResolver, LocationService],
  exports: [LocationService],
})
export class LocationModule {}
