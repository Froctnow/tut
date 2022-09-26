import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import ActivityEntity from "src/database/entities/Activity";
import { Repository } from "typeorm";
import { ImageService } from "../image/image.service";

@Injectable()
export class ActivityService {
  constructor(
    // Repositories
    @InjectRepository(ActivityEntity)
    private activityRepository: Repository<ActivityEntity>,

    private imageService: ImageService,
  ) {}

  async create(name: string, file: FileUpload) {
    const entity = this.activityRepository.create({ name });

    await this.activityRepository.save(entity);

    await this.imageService.createImageActivity(entity, file);
  }

  async delete(id: string) {
    await this.activityRepository.delete(id);
  }

  async update(id: string, name: string) {
    await this.activityRepository.update(id, { name });
  }

  async getAll() {
    return await this.activityRepository.find({ relations: ["image"] });
  }

  async getById(id: string) {
    return await this.activityRepository.findOne({ id }, { relations: ["image"] });
  }
}
