import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class LocationUpdateInputModel {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  activities?: string[];

  @Field(() => [String], { nullable: true })
  seasons?: string[];

  @Field(() => [String])
  hashtagList?: string[] = [];
}
