import { ArgsType, Field, Float } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetLocationCoordinateArgs {
  @Field(() => Float)
  @IsNotEmpty()
  x: number;

  @Field(() => Float)
  @IsNotEmpty()
  y: number;
}
