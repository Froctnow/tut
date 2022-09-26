import { Field, ObjectType } from "@nestjs/graphql";
import { LocationFullModel } from "./location.full";

@ObjectType()
export class LocationFavorites {
  @Field(() => [LocationFullModel])
  locations: LocationFullModel[];

  @Field()
  total: number;
}
