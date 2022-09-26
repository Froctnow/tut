import { Field, ObjectType } from "@nestjs/graphql";
import { ReviewLocationModel } from ".";
import { ReviewUserRatingModel } from "./review.user.rating";
@ObjectType()
export class ReviewsLocationModel {
  @Field(() => [ReviewUserRatingModel])
  reviews: ReviewUserRatingModel[];

  @Field(() => ReviewUserRatingModel, { nullable: true })
  userReview: ReviewLocationModel;

  @Field(() => Number)
  total: number;
}
