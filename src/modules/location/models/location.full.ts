import { Field, ObjectType } from "@nestjs/graphql";
import { ActivityEntity, CategoryEntity, HashtagEntity, UserEntity } from "src/database/entities";
import ImageLocationEntity from "src/database/entities/images/ImageLocation";
import SeasonEntity from "src/database/entities/Season";
import { LocationFavoriteModel } from "./location.favorite";

@ObjectType()
export class LocationFullModel extends LocationFavoriteModel {
  @Field(() => [HashtagEntity])
  hashtags: HashtagEntity[];

  @Field(() => [ActivityEntity])
  activities: ActivityEntity[];

  @Field(() => CategoryEntity)
  category: CategoryEntity;

  @Field(() => [SeasonEntity])
  seasons: SeasonEntity[];

  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => [ImageLocationEntity])
  images: ImageLocationEntity[];
}
