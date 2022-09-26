import ImageLocationEntity from "../../database/entities/images/ImageLocation";
import { define } from "typeorm-seeding";

define(ImageLocationEntity, () => {
  return new ImageLocationEntity();
});
