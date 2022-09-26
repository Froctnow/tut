import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import LocationEntity from "./entities/Location";
import HashtagEntity from "./entities/Hashtag";
import UserEntity from "./entities/User";
import RoleEntity from "./entities/Role";
import ImageLocationEntity from "./entities/images/ImageLocation";
import ImageReviewEntity from "./entities/images/ImageReview";
import ReviewEntity from "./entities/Review";
import EstimationEntity from "./entities/Estimation";
import CategoryEntity from "./entities/Category";
import ImageActivityEntity from "./entities/images/ImageActivity";
import ImageCategoryEntity from "./entities/images/ImageCategory";
import ActivityEntity from "./entities/Activity";
import LocationCheckEntity from "./entities/LocationCheck";
import SeasonEntity from "./entities/Season";

@Module({})
export class DatabaseModule {
  public static register(params) {
    return {
      module: DatabaseModule,
      global: true,
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          host: params.env.DB_IP,
          port: +params.env.DB_PORT,
          username: params.env.DB_USERNAME,
          password: params.env.DB_PASSWORD,
          database: params.env.DB_NAME,
          entities: [
            LocationEntity,
            ImageLocationEntity,
            ImageReviewEntity,
            ImageActivityEntity,
            ImageCategoryEntity,
            ActivityEntity,
            HashtagEntity,
            UserEntity,
            RoleEntity,
            ReviewEntity,
            EstimationEntity,
            CategoryEntity,
            LocationCheckEntity,
            SeasonEntity,
          ],
          synchronize: !!params.env.DB_SYNCRHONIZE || false,
          migrationsTableName: "migrations",
          migrations: ["migration/*.ts"],
          cli: { migrationsDir: "migration" },
        }),
      ],
      providers: [],
    };
  }
}
