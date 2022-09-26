import { Field, Float, ObjectType } from "@nestjs/graphql";
import { LocationFullModel } from "./location.full";

@ObjectType()
export class LocationSearchModel extends LocationFullModel {
  @Field(() => Float, { nullable: true })
  score: number;
}
