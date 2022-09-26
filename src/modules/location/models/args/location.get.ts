import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetLocationArgs {
  @Field()
  @IsNotEmpty()
  locationId: string;
}
