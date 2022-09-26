import CategoryEntity from "../../database/entities/Category";
import { define } from "typeorm-seeding";

define(CategoryEntity, () => {
  const category = new CategoryEntity();

  return category;
});
