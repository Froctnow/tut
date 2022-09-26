import HashtagEntity from "../../database/entities/Hashtag";
import { define } from "typeorm-seeding";
import faker from "faker";

define(HashtagEntity, () => {
  const hashtag = new HashtagEntity();

  faker.locale = "ru";

  hashtag.name = faker.lorem.word();

  return hashtag;
});
