/* eslint-disable no-await-in-loop */
/* eslint-disable object-curly-newline */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ActivityEntity, CategoryEntity, HashtagEntity, LocationEntity, ReviewEntity, UserEntity } from "src/database/entities";
import { FileUpload } from "graphql-upload";
import { ImageService } from "../image/image.service";
import { InjectRepository } from "@nestjs/typeorm";
import { HashtagService } from "../hashtag/hashtag.service";
import { In, Repository } from "typeorm";
import { doInParallel } from "src/utils";
import { ESService } from "../../elastic_search/ES.service";
import { IndexList } from "src/enums/es_index";
import { LocationMapping } from "src/elastic_search/mapping";
import { LocationSearchDto } from "./dto/location.search.dto";
import { LocationCheckStatuses } from "src/enums/location.check.status";
import { LocationCheckService } from "./modules/location_check/location.check.service";
import { UserJwtDto } from "../user/dto/user.jwt.dto";
import { LocationRelations, ReviewRelations } from "../../enums/relations";
import { UserService } from "../user/user.service";
import {
  LocationCreateInputModel,
  LocationDeleteInputModel,
  LocationSearchModel,
  LocationSearchResponseModel,
  LocationUpdateInputModel,
  MyLocationsModel,
  LocationFavorites,
} from "./models";
import { LocationFullModel } from "./models/location.full";
import { LocationFavoriteModel } from "./models/location.favorite";
import { SearchFilters } from "./models/args/location.search.filters";
import SeasonEntity from "src/database/entities/Season";
import { SearchRequest } from "./dto/search.request";
import { Point } from "geojson";
import { LocationPoints } from "./models/args/location.points";
@Injectable()
export class LocationService {
  constructor(
    // Repositories
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,

    @InjectRepository(ActivityEntity)
    private activityRepository: Repository<ActivityEntity>,

    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,

    // Services
    private imageService: ImageService,
    private hashtagService: HashtagService,
    private elasticService: ESService,
    private locationCheckService: LocationCheckService,
    private userService: UserService,
  ) {}

  private async generateHashtags(names: string[]): Promise<HashtagEntity[]> {
    const [hashtags, nameList] = await this.hashtagService.checkExists(names);
    const result: HashtagEntity[] = [];

    for (const name of names) {
      if (nameList.includes(name)) continue;

      result.push(this.hashtagService.createEntity(name));
    }

    for (const hashtag of hashtags) {
      result.push(hashtag);
    }

    return result;
  }

  async create(location: LocationCreateInputModel, userId: string, fileList: FileUpload[]): Promise<LocationEntity> {
    const check = await this.locationRepository
      .createQueryBuilder("locations")
      .where(`st_within(point, st_point(${location.x}, ${location.y}))`)
      .getCount();

    if (check) throw new HttpException("Location with coordinates already exists", HttpStatus.CONFLICT);

    const category = await this.categoryRepository.findOne({ id: location.category });
    const activities = await this.activityRepository.find({ id: In(location.activities) });
    const seasons = await this.seasonRepository.find({ id: In(location.seasons) });

    const entity = new LocationEntity();

    entity.title = location.title;
    entity.description = location.description;

    const point: Point = { type: "Point", coordinates: [location.x, location.y] };

    entity.point = point;

    entity.rating = 0;

    entity.user = new UserEntity();
    entity.user.id = userId;

    entity.category = new CategoryEntity();
    entity.category.id = category.id;
    entity.category.name = category.name;

    entity.images = [];
    entity.activities = activities;
    entity.seasons = seasons;

    entity.hashtags = await this.generateHashtags(location.hashtagList);

    await doInParallel(fileList, file => this.imageService.createImageLocation(entity, file));

    await this.locationRepository.save(entity);

    try {
      await this.elasticService.createEntity<LocationMapping>(IndexList.LOCATION, {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        hashtags: entity.hashtags.map(hashtag => hashtag.name),
        category: category.name,
        reviews: [],
        activities: activities.map(activity => activity.name),
        seasons: seasons.map(season => season.name),
        status: LocationCheckStatuses.CREATED,
      });
    } catch (error) {
      console.log("Index location doesn't created", error);
    }

    await this.locationCheckService.create(entity);

    return entity;
  }

  async findById(id: string, user: UserJwtDto): Promise<LocationFullModel> {
    const location = await this.locationRepository.findOne(id, {
      relations: [
        LocationRelations.hashtags,
        LocationRelations.images,
        LocationRelations.user,
        LocationRelations.category,
        LocationRelations.activities,
        LocationRelations.seasons,
      ],
    });

    let isFavorite = false;

    if (user) {
      isFavorite = !!(await this.locationRepository
        .createQueryBuilder("l")
        .leftJoin("favorites_locations", "fl", "l.id = fl.locationsId")
        .where("l.id = :locationId", { locationId: id })
        .andWhere("fl.usersId = :userId", { userId: user.id })
        .getCount());
    }

    return { ...location, isFavorite };
  }

  async findByPoints(locationPoints: LocationPoints): Promise<LocationFullModel[]> {
    const points: string =
      locationPoints.points.map(point => `${point.x} ${point.y}`).join(",") + ", " + locationPoints.points[0].x + " " + locationPoints.points[0].y;

    const locationsId: string[] = (
      await this.locationRepository
        .createQueryBuilder("locations")
        .select("id")
        .where(`st_within(point,st_geometryfromtext('POLYGON((${points}))'))`)
        .execute()
    ).map(({ id }) => id);

    return this.locationRepository.find({
      where: { id: In(locationsId) },
      relations: [
        LocationRelations.hashtags,
        LocationRelations.images,
        LocationRelations.user,
        LocationRelations.category,
        LocationRelations.activities,
        LocationRelations.seasons,
      ],
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const location = await this.locationRepository.findOne(id, { relations: [LocationRelations.user, LocationRelations.hashtags] });

    if (!location) throw new HttpException("Location not found", HttpStatus.NOT_FOUND);

    if (location.user.id !== userId) throw new HttpException("Access forbidden", HttpStatus.FORBIDDEN);

    await this.locationRepository.softDelete(location.id);
    await this.elasticService.deleteEntity({ index: IndexList.LOCATION, body: { query: { term: { id } } } });
    await this.hashtagService.deleteByLocationId(
      location.hashtags.map(h => h.name),
      id,
    );
  }

  async search(filters: SearchFilters, size: number, from: number, user?: UserJwtDto): Promise<LocationSearchResponseModel> {
    const request: SearchRequest = {
      body: {
        min_score: 0.1,
        query: {
          bool: {
            filter: [],
          },
        },
      },
      size,
      from,
    };

    request.body.query.bool.filter.push({ term: { status: LocationCheckStatuses.APPROVED } });

    if (filters.messageSearch) {
      request.body.query.bool.should = [];

      request.body.query.bool.should.push({ query_string: { fields: ["title", "description"], query: filters.messageSearch } });
      request.body.query.bool.should.push({
        nested: {
          path: "reviews",
          query: { bool: { should: [{ query_string: { fields: ["reviews.description"], query: filters.messageSearch } }] } },
        },
      });
    }

    if (filters.activities?.length || filters.categories?.length || filters.seasons?.length) {
      request.body.query.bool.must = {};
      request.body.query.bool.must.bool = {};
      request.body.query.bool.must.bool.should = [];
    }

    if (filters.activities) {
      for (const activity of filters.activities) {
        const { name } = await this.activityRepository.findOne(activity);

        request.body.query.bool.must.bool.should.push({ term: { activities: name } });
      }
    }

    if (filters.categories) {
      for (const category of filters.categories) {
        const { name } = await this.categoryRepository.findOne(category);

        request.body.query.bool.must.bool.should.push({ term: { category: name } });
      }
    }

    if (filters.seasons) {
      for (const season of filters.seasons) {
        const { name } = await this.seasonRepository.findOne(season);

        request.body.query.bool.must.bool.should.push({ term: { seasons: name } });
      }
    }

    const { body } = await this.elasticService.search(request);

    if (!body.hits.hits.length) return { locations: [], total: 0 };

    const responseMap: Map<string, number> = new Map();
    const locationSeachList: LocationSearchDto[] = [];
    const response: LocationSearchModel[] = [];

    for (const location of body.hits.hits as LocationMapping[]) {
      responseMap.set(location._source.id, location._score);
    }

    for (const [key, value] of responseMap) {
      locationSeachList.push({ id: key, score: value });
    }

    const entityList = await this.locationRepository.find({
      relations: [
        LocationRelations.hashtags,
        LocationRelations.images,
        LocationRelations.user,
        LocationRelations.category,
        LocationRelations.activities,
        LocationRelations.seasons,
      ],
      where: { id: In(locationSeachList.map(location => location.id)) },
    });

    let locationIds = [];

    if (user && entityList.length) {
      const result = await this.locationRepository
        .createQueryBuilder("l")
        .leftJoin("favorites_locations", "fl", "l.id = fl.locationsId")
        .where("l.id in (:...locationIds)", { locationIds: entityList.map(entity => entity.id) })
        .andWhere("fl.usersId = :userId", { userId: user.id })
        .select("l.id")
        .execute();

      locationIds = result.map(entity => entity.l_id);
    }

    for (const location of entityList) {
      response.push({ ...location, score: responseMap.get(location.id), isFavorite: locationIds.includes(location.id) });
    }

    return { total: body.hits.total.value, locations: response.sort((a, b) => b.score - a.score) };
  }

  async calculateRating(locationId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({ where: { location: { id: locationId } }, relations: [ReviewRelations.estimations] });
    const location = await this.locationRepository.findOne(locationId);

    let rating = 0;

    for (const review of reviews) {
      if (!review.estimations.length) continue;

      let weight = 0;

      for (const estimation of review.estimations) {
        weight += estimation.sign ? 1 : -1;
      }

      if (weight <= 0) continue;
      console.log(weight);

      if (review.isRecommend) rating += weight;
      else rating -= weight;
    }

    location.rating = rating;

    await this.locationRepository.save(location);
  }

  async edit(
    locationId: string,
    update: LocationUpdateInputModel,
    deleteContent: LocationDeleteInputModel,
    files: FileUpload[] = [],
    user: UserJwtDto,
  ): Promise<LocationEntity> {
    const location = await this.findById(locationId, user);

    if (location.user.id !== user.id) throw new HttpException("Access forbidden", HttpStatus.FORBIDDEN);

    if (update.title && location.title !== update.title) location.title = update.title;
    if (update.description && location.description !== update.description) location.description = update.description;
    if (update.category && location.category.id !== update.category) {
      const category = await this.categoryRepository.findOne({ id: update.category });

      location.category = category;
    }

    const hashtagsForDelete = (await this.hashtagService.findByNames(deleteContent.hashtagList)).map(h => h.id);

    location.hashtags = location.hashtags.filter(hashtag => !hashtagsForDelete?.includes(hashtag.id));
    location.images = location.images.filter(image => !deleteContent.files?.includes(image.id));

    if (update.activities?.length) {
      const activities = await this.activityRepository.find({ id: In(update.activities) });

      location.activities = [...location.activities, ...activities];
    }

    if (deleteContent.activities?.length) {
      location.activities = location.activities.filter(activity => !deleteContent.activities.includes(activity.id));
    }

    if (update.seasons?.length) {
      const seasons = await this.seasonRepository.find({ id: In(update.seasons) });

      location.seasons = [...location.seasons, ...seasons];
    }

    if (deleteContent.seasons?.length) {
      location.seasons = location.seasons.filter(season => !deleteContent.seasons.includes(season.id));
    }

    const hashtags = await this.generateHashtags(update.hashtagList);

    for (const hashtag of hashtags) {
      location.hashtags.push(hashtag);
    }

    await doInParallel(files, file => this.imageService.createImageLocation(location, file));

    await this.locationRepository.save(location);

    return this.findById(locationId, user);
  }

  async waitUploadFiles(fileList: Promise<FileUpload>[]) {
    const files: FileUpload[] = [];

    await doInParallel(fileList, file => file.then(res => files.push(res)));

    for (const file of files) {
      if (!["image/png", "image/webp", "image/jpeg"].includes(file.mimetype))
        throw new HttpException("Format file doesn't support. Use png, webp, jpeg", HttpStatus.BAD_REQUEST);
    }

    return files;
  }

  async getLocationByUserId(user: UserJwtDto, skip = 0, take = 20) {
    const where = { user: { id: user.id } };

    const locations = await this.locationRepository.find({
      where,
      skip,
      take,
      relations: [LocationRelations.locationCheck],
    });

    const count = await this.locationRepository.count(where);

    return { locations, count };
  }

  async addFavorite(locationId: string, userDto: UserJwtDto): Promise<LocationFavoriteModel> {
    const location = await this.locationRepository.findOne(locationId, { relations: [LocationRelations.users_favorites] });

    if (!location) throw new HttpException("Location doesn't exist", HttpStatus.NOT_FOUND);

    const user = await this.userService.getUserById(userDto.id);

    if (!user) throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);

    const isExists = location.users_favorites.find(user => user.id === user.id);

    if (isExists) throw new HttpException("Location already added into favorites", HttpStatus.CONFLICT);

    location.users_favorites.push(user);

    return { ...(await this.locationRepository.save(location)), isFavorite: true };
  }

  async deleteFavorite(locationId: string, userDto: UserJwtDto): Promise<LocationFavoriteModel> {
    const location = await this.locationRepository.findOne(locationId, { relations: [LocationRelations.users_favorites] });

    if (!location) throw new HttpException("Location doesn't exist", HttpStatus.NOT_FOUND);

    const user = await this.userService.getUserById(userDto.id);

    if (!user) throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);

    const isExist = await this.locationRepository
      .createQueryBuilder("l")
      .leftJoin("favorites_locations", "fl", "l.id = fl.locationsId")
      .where("l.id = :locationId", { locationId })
      .andWhere("fl.usersId = :userId", { userId: user.id })
      .getCount();

    if (!isExist) throw new HttpException("User hasn't that location in favorite", HttpStatus.BAD_REQUEST);

    location.users_favorites = location.users_favorites.filter(entity => entity.id !== userDto.id);

    return { ...(await this.locationRepository.save(location)), isFavorite: false };
  }

  async getMyLocations(userDto: UserJwtDto, take: number = 0, skip: number = 20): Promise<MyLocationsModel> {
    const result = await this.locationRepository.findAndCount({
      where: { user: { id: userDto.id } },
      relations: [
        LocationRelations.hashtags,
        LocationRelations.images,
        LocationRelations.user,
        LocationRelations.category,
        LocationRelations.activities,
        LocationRelations.seasons,
        LocationRelations.locationCheck,
      ],
      skip,
      take,
    });

    return { locations: result[0], total: result[1] };
  }

  async getMyFavoritesLocations(userDto: UserJwtDto, take: number = 0, skip: number = 20): Promise<LocationFavorites> {
    const result: { l_id: string }[] = await this.locationRepository
      .createQueryBuilder("l")
      .leftJoin("favorites_locations", "fl", "l.id = fl.locationsId")
      .where("fl.usersId = :userId", { userId: userDto.id })
      .limit(take)
      .offset(skip)
      .select("l.id")
      .execute();

    const total = await this.locationRepository
      .createQueryBuilder("l")
      .leftJoin("favorites_locations", "fl", "l.id = fl.locationsId")
      .where("fl.usersId = :userId", { userId: userDto.id })
      .getCount();

    const locations: LocationFullModel[] = await this.locationRepository.find({
      where: { id: In(result.map(r => r.l_id)) },
      relations: [
        LocationRelations.hashtags,
        LocationRelations.images,
        LocationRelations.user,
        LocationRelations.category,
        LocationRelations.activities,
        LocationRelations.seasons,
      ],
    });

    for (const location of locations) {
      location.isFavorite = true;
    }

    return { locations, total };
  }
}
