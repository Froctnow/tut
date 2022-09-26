import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class LocationDeleteInputModel {
  @Field(() => [String], { nullable: true })
  hashtagList?: string[];

  @Field(() => [String], { nullable: true })
  activities?: string[];

  @Field(() => [String], { nullable: true })
  seasons?: string[];

  @Field(() => [String], { nullable: true })
  files?: string[] = [];
}
