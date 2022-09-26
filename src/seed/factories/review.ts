import ReviewEntity from "../../database/entities/Review";
import { define } from "typeorm-seeding";
import faker from "faker";

define(ReviewEntity, () => {
  const review = new ReviewEntity();

  faker.locale = "ru";

  review.description = faker.lorem.text();
  review.rating = 0;
  review.isRecommend = Boolean(faker.datatype.number({ min: 0, max: 1 }));

  return review;
});
