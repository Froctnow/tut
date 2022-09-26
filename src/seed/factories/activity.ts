import { define } from "typeorm-seeding";
import ActivityEntity from "../../database/entities/Activity";

define(ActivityEntity, () => {
  const activity = new ActivityEntity();

  return activity;
});
