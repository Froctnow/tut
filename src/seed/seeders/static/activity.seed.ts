import ActivityEntity from "../../../database/entities/Activity";
import { doInParallel } from "../../../utils";
import { Connection } from "typeorm";
import { Seeder, Factory } from "typeorm-seeding";
import fs from "fs";
import { createImage, storage } from "../utils";
import { v4 as uuid } from "uuid";
import ImageActivityEntity from "../../../database/entities/images/ImageActivity";

export default class ActivitySeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const activities = [
      { name: "Рыбалка", code: "fishing" },
      { name: "Туризм", code: "tourism" },
      { name: "Фотосессия", code: "photosession" },
      { name: "Шашлыки", code: "kebabs" },
      { name: "Купание", code: "swimming" },
      { name: "Другое", code: "other" },
      { name: "Палатки", code: "camping" },
      { name: "Поход", code: "hike" },
    ];
    const imagePath = `${process.cwd()}/src/seed/marker.png`;

    const readStream = fs.createReadStream(imagePath);

    await doInParallel(activities, async activity => {
      const fileName = uuid();

      await createImage(readStream, fileName, storage);

      const image = new ImageActivityEntity();

      image.id = fileName;

      return factory(ActivityEntity)().create({ name: activity.name, code: activity.code, image });
    });
  }
}
