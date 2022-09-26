import RoleEntity from "../../database/entities/Role";
import { define } from "typeorm-seeding";

define(RoleEntity, () => {
  return new RoleEntity();
});
