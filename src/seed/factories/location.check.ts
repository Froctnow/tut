import LocationCheck from "../../database/entities/LocationCheck";
import { define } from "typeorm-seeding";
import { LocationCheckStatuses } from "../../enums/location.check.status";

define(LocationCheck, () => {
  const locationCheck = new LocationCheck();

  locationCheck.status = LocationCheckStatuses.CREATED;

  return locationCheck;
});
