import CategoryEntity from "../../../database/entities/Category";
import { doInParallel } from "../../../utils";
import { Connection } from "typeorm";
import { Seeder, Factory } from "typeorm-seeding";
import ImageCategory from "../../../database/entities/images/ImageCategory";
import { createImage, storage } from "../utils";
import fs from "fs";
import { v4 as uuid } from "uuid";

export default class CategorySeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const categories = [
      { name: "Природа", code: "natural" },
      { name: "Арт объект", code: "art" },
      { name: "Городская среда", code: "urban_environment" },
      { name: "Достопримечательность", code: "sight" },
      { name: "Заброшенное место", code: "abandoned_place" },
    ];

    const imagePath = `${process.cwd()}/src/seed/marker.png`;

    const readStream = fs.createReadStream(imagePath);

    await doInParallel(categories, async category => {
      const fileName = uuid();

      await createImage(readStream, fileName, storage);

      const image = new ImageCategory();

      image.id = fileName;

      return factory(CategoryEntity)().create({ name: category.name, code: category.code, image });
    });
  }
}
