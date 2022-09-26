import SeasonEntity from "../../../database/entities/Season";
import { doInParallel } from "../../../utils";
import { Connection } from "typeorm";
import { Seeder, Factory } from "typeorm-seeding";

export default class SeasonSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const seasons = [
      { name: "Зима", code: "winter" },
      { name: "Осень", code: "autumn " },
      { name: "Весна", code: "spring" },
      { name: "Лето", code: "summer" },
    ];

    await doInParallel(seasons, async season => {
      return factory(SeasonEntity)().create({ name: season.name, code: season.code });
    });
  }
}
