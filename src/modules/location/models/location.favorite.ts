import { Field, ObjectType } from "@nestjs/graphql";
import { LocationEntity } from "src/database/entities";

@ObjectType()
export class LocationFavoriteModel extends LocationEntity {
  @Field({ nullable: true })
  isFavorite?: boolean;
}
