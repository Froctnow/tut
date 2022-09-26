import { Field, ObjectType } from "@nestjs/graphql";
import { ReviewEntity, UserEntity } from "src/database/entities";
import ImageReviewEntity from "src/database/entities/images/ImageReview";

@ObjectType()
class UserRating {
  @Field()
  sign: boolean;
}

@ObjectType()
export class ReviewUserRatingModel extends ReviewEntity {
  @Field(() => UserRating, { nullable: true })
  userRating: UserRating;

  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => [ImageReviewEntity])
  images?: ImageReviewEntity[];
}
