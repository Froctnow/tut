import { Field, Float, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class PointDto {
  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  x: number;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  y: number;
}
