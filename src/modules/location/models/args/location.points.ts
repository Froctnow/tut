import { Field, InputType } from "@nestjs/graphql";
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { PointDto } from "../../dto/point.dto";

@InputType()
export class LocationPoints {
  @ValidateNested({ each: true })
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsArray()
  @Field(() => [PointDto])
  points: PointDto[];
}
