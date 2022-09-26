import { define, factory } from "typeorm-seeding";
import UserEntity from "../../database/entities/User";
import RoleEntity from "../../database/entities/Role";
import faker from "faker";
import { v4 as uuid } from "uuid";

define(UserEntity, () => {
  const user = new UserEntity();

  faker.locale = "ru";

  user.id = uuid();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.displayName = user.firstName + " " + user.lastName;
  user.email = faker.internet.email();
  user.externalId = uuid();
  user.roles = [factory(RoleEntity)() as any];

  return user;
});
