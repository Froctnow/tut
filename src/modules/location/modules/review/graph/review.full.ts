import { Field, ObjectType } from "@nestjs/graphql";
import { LocationEntity, ReviewEntity, UserEntity } from "src/database/entities";
import ImageReviewEntity from "src/database/entities/images/ImageReview";

@ObjectType()
export class ReviewFullModel extends ReviewEntity {
  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => LocationEntity)
  location: LocationEntity;

  @Field(() => [ImageReviewEntity])
  images?: ImageReviewEntity[];
}
