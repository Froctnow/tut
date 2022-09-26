import LocationEntity from "../../database/entities/Location";
import { define } from "typeorm-seeding";
import faker from "faker";
import { Point } from "geojson";

define(LocationEntity, () => {
  const location = new LocationEntity();

  faker.locale = "ru";

  const x = faker.datatype.float({ min: 54.49, max: 55.25, precision: 0.000001 });
  const y = faker.datatype.float({ min: 72.483777, max: 73.703556, precision: 0.000001 });
  const point: Point = { type: "Point", coordinates: [x, y] };

  location.description = faker.lorem.paragraph(3);
  location.title = faker.lorem.sentence(4);
  location.point = point;
  location.rating = 0;

  return location;
});
