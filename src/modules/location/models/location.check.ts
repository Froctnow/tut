import { Field, ObjectType } from "@nestjs/graphql";
import { LocationCheckEntity } from "src/database/entities";
import { LocationFullModel } from "./location.full";

@ObjectType()
export class LocationCheckModel extends LocationFullModel {
  @Field()
  locationCheck: LocationCheckEntity;
}
