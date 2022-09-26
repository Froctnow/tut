import { Field, ObjectType } from "@nestjs/graphql";
import { Point } from "geojson";

@ObjectType()
export class GeoPointDto implements Point {
  @Field()
  public type: "Point";

  @Field(() => [Number])
  public coordinates: number[];

  constructor(type: "Point", coordinates: number[]) {
    this.type = type;
    this.coordinates = coordinates;
  }
}
