import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { EstimationEntity, LocationEntity, ReviewEntity, UserEntity } from "src/database/entities";
import { ESService } from "src/elastic_search/ES.service";
import { IndexList } from "src/enums/es_index";
import { ReviewRelations } from "src/enums/relations";
import { ImageService } from "src/modules/image/image.service";
import { UserJwtDto } from "src/modules/user/dto/user.jwt.dto";
import { doInParallel } from "src/utils";
import { Not, Repository } from "typeorm";
import { LocationService } from "../../location.service";
import { ReviewsLocationModel, ReviewUserRatingModel } from "./graph";
import { SortOptions } from "./graph/args/sort.options";

@Injectable()
export class ReviewService {
  constructor(
    // Repositories
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,

    @InjectRepository(EstimationEntity)
    private estimationRepository: Repository<EstimationEntity>,

    // Services
    private imageService: ImageService,
    private elasticService: ESService,
    private locationService: LocationService,
  ) {}

  async create(locationId: string, description: string, isRecommend: boolean, userId: string, files: FileUpload[]) {
    const entity = new ReviewEntity();

    entity.description = description;
    entity.isRecommend = isRecommend;
    entity.rating = 0;
    entity.images = [];

    entity.user = new UserEntity();
    entity.user.id = userId;

    entity.location = new LocationEntity();
    entity.location.id = locationId;

    await doInParallel(files, file => this.imageService.createImageReview(entity, file));

    const review = await this.reviewRepository.save(entity);

    const { body } = await this.elasticService.search({
      index: IndexList.LOCATION,
      body: { query: { match: { id: locationId } } },
    });

    try {
      await this.elasticService.updateIndex(IndexList.LOCATION, body.hits.hits[0]._id, {
        script: {
          source: "ctx._source.reviews.add(params.review)",
          params: {
            review: {
              id: review.id,
              description: review.description,
            },
          },
        },
      });
    } catch (error) {
      console.log("Index for review doesn't created", error);
    }

    return entity;
  }

  async updateRating(reviewId: string, user: UserJwtDto, sign: boolean): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({ id: reviewId }, { relations: ["user"] });

    if (!review) throw new HttpException("Review not found", HttpStatus.NOT_FOUND);

    if (review.user.id === user.id) throw new HttpException("You can't estimate your review", HttpStatus.BAD_REQUEST);

    const estimation = await this.estimationRepository.findOne({ user: { id: user.id }, review: { id: reviewId } });

    if (estimation && estimation.sign !== sign) {
      estimation.sign = sign;

      await this.estimationRepository.save(estimation);
      return this.calculateRating(reviewId);
    } else if (estimation && estimation.sign === sign) {
      await this.estimationRepository.softDelete(estimation.id);
      return this.calculateRating(reviewId);
    }

    await this.estimationRepository.save(this.estimationRepository.create({ sign, user: { id: user.id }, review: { id: reviewId } }));
    return this.calculateRating(reviewId);
  }

  async edit(
    reviewId: string,
    description: string,
    isRecommend: boolean = null,
    userId: string,
    deleteFiles: string[] = [],
    files: FileUpload[] = [],
  ): Promise<ReviewEntity> {
    const entity = await this.reviewRepository.findOne({ id: reviewId }, { relations: [ReviewRelations.user, ReviewRelations.images] });

    if (!entity) throw new HttpException("Not found", HttpStatus.NOT_FOUND);

    if (entity.user.id !== userId) throw new HttpException("Access forbidden", HttpStatus.FORBIDDEN);

    const now = new Date();
    const diffInMilliSeconds = Math.abs(entity.created_at.getTime() - now.getTime()) / 1000;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;

    if (hours >= 24) throw new HttpException("Date of created more than 24 hours", HttpStatus.BAD_REQUEST);

    if (description) entity.description = description;

    if (isRecommend !== null) entity.isRecommend = isRecommend;

    entity.images = entity.images.filter(image => !deleteFiles.includes(image.id));

    await doInParallel(files, file => this.imageService.createImageReview(entity, file));

    return await this.reviewRepository.save(entity);
  }

  async delete(reviewId: string, userId: string): Promise<void> {
    const entity = await this.reviewRepository.findOne({ id: reviewId }, { relations: ["user"] });

    if (entity.user.id !== userId) throw new HttpException("Access forbidden", HttpStatus.FORBIDDEN);

    await this.reviewRepository.softDelete({ id: reviewId });
  }

  async reviewsByLocation(locationId: string, options: SortOptions, user: UserJwtDto): Promise<ReviewsLocationModel> {
    const result: ReviewsLocationModel = {
      reviews: [],
      userReview: null,
      total: 0,
    };

    const where = user ? { location: { id: locationId }, user: { id: Not(user.id) } } : { location: { id: locationId } };

    const reviews = await this.reviewRepository.find({
      where,
      order: { [options.field]: options.direction },
      relations: ["user", "images"],
      skip: options.skip,
      take: options.take,
    });

    if (!reviews.length) return result;

    const unionResults: { reviews_id: string; estimation_sign: boolean }[] = await this.reviewRepository
      .createQueryBuilder("reviews")
      .innerJoin("estimations", "estimation", "reviews.id = estimation.reviewId")
      .where("reviews.id in (:...reviews)", { reviews: reviews.map(review => review.id) })
      .andWhere("estimation.userId = :userId", { userId: user?.id })
      .select("reviews.id")
      .addSelect("estimation.sign")
      .execute();

    for (const review of reviews) {
      const userIsSign = unionResults.find(ur => ur.reviews_id === review.id);

      result.reviews.push({ ...review, userRating: userIsSign ? { sign: userIsSign.estimation_sign } : null });
    }

    const countWhere = { location: { id: locationId } };
    const countWhereUser = user ? { ...countWhere, user: { id: Not(user.id) } } : countWhere;

    result.total = await this.reviewRepository.count(countWhereUser);

    if (user) {
      result.userReview = await this.reviewRepository.findOne({
        where: { location: { id: locationId }, user: { id: user.id } },
        relations: ["user", "images"],
      });
    }

    return result;
  }

  async calculateRating(reviewId: string) {
    const review = await this.reviewRepository.findOne(reviewId, { relations: ["estimations", "location"] });

    let rating = 0;

    for (const estimation of review.estimations) {
      if (estimation.sign) rating += 1;
      else rating -= 1;
    }

    review.rating = rating;

    const result = await this.reviewRepository.save(review);

    await this.locationService.calculateRating(review.location.id);

    return result;
  }

  async getReviewById(id: string, user?: UserJwtDto): Promise<ReviewUserRatingModel> {
    const unionResults: { estimation_sign: boolean }[] = await this.reviewRepository
      .createQueryBuilder("reviews")
      .innerJoin("estimations", "estimation", "reviews.id = estimation.reviewId")
      .where("reviews.id = :reviewId", { reviewId: id })
      .andWhere("estimation.userId = :userId", { userId: user?.id })
      .select("estimation.sign")
      .execute();

    const review = await this.reviewRepository.findOne(id, { relations: ["user", "location", "images"] });

    return { ...review, userRating: unionResults[0] && { sign: unionResults[0].estimation_sign } };
  }
}
