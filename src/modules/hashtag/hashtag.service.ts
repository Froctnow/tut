import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import HashtagEntity from "src/database/entities/Hashtag";
import { arrayDifference } from "src/utils";
import { In, Repository } from "typeorm";

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(HashtagEntity)
    private readonly hashtagRepository: Repository<HashtagEntity>,
  ) {}

  async checkExists(nameList: string[]): Promise<[HashtagEntity[], string[]]> {
    if (!nameList) return [[], []];

    const hashtags = await this.hashtagRepository.find({ name: In(nameList) });

    const names = hashtags.map(h => h.name);

    return [hashtags, names];
  }

  createEntity(name: string): HashtagEntity {
    return this.hashtagRepository.create({ name });
  }

  async deleteByLocationId(hashtags: string[], locationId: string): Promise<void> {
    const results: any[] = await this.hashtagRepository
      .createQueryBuilder("h")
      .innerJoin("h.locationList", "lhh")
      .where("h.name in (:...hashtags)", { hashtags })
      .andWhere("lhh.id != :locationId", { locationId })
      .select("h.name")
      .groupBy("h.name")
      .execute();

    const resultsString = results.map(r => r.h_name);

    await this.hashtagRepository.softDelete({ name: In(arrayDifference(hashtags, resultsString)) });
  }

  findLocations(hashtags: string[]): Promise<string[]> {
    return this.hashtagRepository
      .createQueryBuilder("h")
      .innerJoin("h.locationList", "lhh")
      .where("h.name in (:...hashtags)", { hashtags })
      .select("lhh.locationsId")
      .groupBy("lhh.locationsId")
      .execute();
  }

  async findByNames(names: string[]): Promise<HashtagEntity[]> {
    return this.hashtagRepository.find({ where: { name: In(names) } });
  }
}
