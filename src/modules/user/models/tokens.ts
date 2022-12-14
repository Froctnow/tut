import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ObjectType()
export class TokensModel {
  @IsNotEmpty()
  @IsString()
  @Field()
  jwt: string;
}
