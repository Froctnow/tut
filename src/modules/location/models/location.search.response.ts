import { Field, ObjectType } from "@nestjs/graphql";
import { LocationSearchModel } from "./location.search";

@ObjectType()
export class LocationSearchResponseModel {
  @Field(() => [LocationSearchModel])
  locations: LocationSearchModel[];

  @Field()
  total: number;
}
