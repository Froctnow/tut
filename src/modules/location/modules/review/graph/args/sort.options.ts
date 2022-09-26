import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SortOptions {
  @Field()
  @IsNotEmpty()
  field: string = "rating";

  @Field()
  @IsNotEmpty()
  direction: string = "ASC";

  @Field()
  @IsNotEmpty()
  skip: number = 0;

  @Field()
  @IsNotEmpty()
  take: number = 1;
}
