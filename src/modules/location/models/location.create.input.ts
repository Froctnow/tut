import { Field, InputType, Float } from "@nestjs/graphql";
@InputType()
export class LocationCreateInputModel {
  @Field()
  title: string;

  @Field(() => Float)
  x: number;

  @Field(() => Float)
  y: number;

  @Field()
  description: string;

  @Field()
  category: string;

  @Field(() => [String])
  activities: string[];

  @Field(() => [String])
  seasons: string[];

  // array of name hashtag
  @Field(() => [String], { nullable: true })
  hashtagList: string[];
}
