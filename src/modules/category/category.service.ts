import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import CategoryEntity from "src/database/entities/Category";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    // Repositories
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAll() {
    return await this.categoryRepository.find({ relations: ["image"] });
  }

  async getById(id: string) {
    return await this.categoryRepository.findOne({ id }, { relations: ["image"] });
  }
}
