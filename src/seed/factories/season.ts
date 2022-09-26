import { define } from "typeorm-seeding";
import SeasonEntity from "../../database/entities/Season";

define(SeasonEntity, () => {
  const season = new SeasonEntity();

  return season;
});
