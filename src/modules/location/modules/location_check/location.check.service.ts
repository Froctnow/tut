import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import LocationEntity from "src/database/entities/Location";
import LocationCheckEntity from "src/database/entities/LocationCheck";
import { LocationCheckStatuses } from "src/enums/location.check.status";
import { Roles } from "src/enums/roles";
import { UserJwtDto } from "src/modules/user/dto/user.jwt.dto";
import { In, Repository } from "typeorm";

@Injectable()
export class LocationCheckService {
  constructor(
    // Repositories
    @InjectRepository(LocationCheckEntity)
    private locationCheckRepository: Repository<LocationCheckEntity>,
  ) {}

  async create(location: LocationEntity) {
    const entity = new LocationCheckEntity();

    entity.location = location;
    entity.status = LocationCheckStatuses.CREATED;

    await this.locationCheckRepository.save(entity);
  }

  async updateStatus(locationId: string, status: string, user: UserJwtDto) {
    const locationCheck = await this.locationCheckRepository.findOne({ location: { id: locationId } }, { relations: ["reviewer"] });

    if (!user.roles.find(role => role.name === Roles.ADMIN) && locationCheck.reviewer.id !== user.id)
      throw new HttpException("Access forbidden", HttpStatus.FORBIDDEN);

    await this.locationCheckRepository.update({ location: { id: locationId } }, { status, reviewer: { id: user.id } });
  }

  async take(locationId: string, user: UserJwtDto) {
    const locationCheck = await this.locationCheckRepository.findOne({ location: { id: locationId } }, { relations: ["reviewer"] });

    if (locationCheck.reviewer) throw new HttpException("Location already is moderating", HttpStatus.BAD_REQUEST);

    locationCheck.reviewer.id = user.id;
    locationCheck.status = LocationCheckStatuses.REVIEW;

    await this.locationCheckRepository.save(locationCheck);
  }

  async findById(locationCheckId: string) {
    return await this.locationCheckRepository.findOne(locationCheckId, { relations: ["reviewer"] });
  }

  async findAll(skip: number, take: number, statuses: string[]) {
    return await this.locationCheckRepository.find({ where: { status: In(statuses) }, skip, take, relations: ["reviewer", "location"] });
  }
}
