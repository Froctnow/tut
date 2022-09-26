import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import SeasonEntity from "src/database/entities/Season";
import { Repository } from "typeorm";

@Injectable()
export class SeasonService {
  constructor(
    // Repositories
    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,
  ) {}

  async getAll() {
    return await this.seasonRepository.find();
  }

  async getById(id: string) {
    return await this.seasonRepository.findOne({ id });
  }
}
