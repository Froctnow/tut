import { Field, ObjectType } from "@nestjs/graphql";
import { ReviewEntity, UserEntity } from "src/database/entities";
import ImageReviewEntity from "src/database/entities/images/ImageReview";

@ObjectType()
export class ReviewLocationModel extends ReviewEntity {
  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => [ImageReviewEntity])
  images?: ImageReviewEntity[];
}
