import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@ArgsType()
export class SearchFilters {
  @Field({ nullable: true })
  @IsOptional()
  messageSearch?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  categories?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  activities?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  seasons?: string[];
}
