import ImageReviewEntity from "../../database/entities/images/ImageReview";
import { define } from "typeorm-seeding";

define(ImageReviewEntity, () => {
  return new ImageReviewEntity();
});
