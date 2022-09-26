import { HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { CurrentUser } from "src/custom_decorators/CurrentUser";
import { Void } from "src/graphql/scalar.void";
import { AuthGuard } from "src/guards/auth.guard";
import { UserJwtDto } from "src/modules/user/dto/user.jwt.dto";
import { doInParallel } from "src/utils";
import { ReviewService } from "./review.service";
import { SortOptions } from "./graph/args/sort.options";
import { ReviewFullModel, ReviewsLocationModel } from "./graph";
import { ReviewEntity } from "src/database/entities";

@Resolver("Review")
export class ReviewResolver {
  constructor(private reviewService: ReviewService) {}

  @Query(() => ReviewsLocationModel, { nullable: true })
  async reviewsByLocation(
    @Args("locationId") locationId: string,
    @Args("options") options: SortOptions,
    @CurrentUser() user: UserJwtDto,
  ): Promise<ReviewsLocationModel> {
    return await this.reviewService.reviewsByLocation(locationId, options, user);
  }

  @Query(() => ReviewFullModel, { nullable: true })
  async reviewById(@Args("reviewId") reviewId: string): Promise<ReviewFullModel> {
    return await this.reviewService.getReviewById(reviewId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ReviewEntity)
  async createReview(
    @CurrentUser() user: UserJwtDto,
    @Args("description") description: string,
    @Args("locationId") locationId: string,
    @Args("isRecommend") isRecommend: boolean,
    @Args({ name: "fileList", type: () => [GraphQLUpload] }) fileList: Promise<FileUpload>[],
  ) {
    const files: FileUpload[] = [];

    await doInParallel(fileList, file => file.then(res => files.push(res)));

    for (const file of files) {
      if (!["image/png", "image/webp", "image/jpeg"].includes(file.mimetype))
        throw new HttpException("Format file doesn't support. Use png, webp, jpeg", HttpStatus.BAD_REQUEST);
    }

    return await this.reviewService.create(locationId, description, isRecommend, user.id, files);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ReviewEntity, { nullable: true })
  async editReview(
    @CurrentUser() user: UserJwtDto,
    @Args("description", { nullable: true }) description: string,
    @Args("id") id: string,
    @Args("isRecommend", { nullable: true }) isRecommend: boolean,
    @Args("deleteFiles", { type: () => [String], nullable: true }) deleteFiles: string[] = [],
    @Args({ name: "fileList", type: () => [GraphQLUpload], nullable: true }) fileList: Promise<FileUpload>[] = [],
  ) {
    const files: FileUpload[] = [];

    await doInParallel(fileList, file => file.then(res => files.push(res)));

    for (const file of files) {
      if (!["image/png", "image/webp", "image/jpeg"].includes(file.mimetype))
        throw new HttpException("Format file doesn't support. Use png, webp, jpeg", HttpStatus.BAD_REQUEST);
    }

    return await this.reviewService.edit(id, description, isRecommend, user.id, deleteFiles, files);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Void, { nullable: true })
  async deleteReview(@CurrentUser() user: UserJwtDto, @Args("id") id: string) {
    await this.reviewService.delete(id, user.id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ReviewEntity, { nullable: true })
  async updateRating(@CurrentUser() user: UserJwtDto, @Args("id") id: string, @Args("sign") sign: boolean): Promise<ReviewEntity> {
    return await this.reviewService.updateRating(id, user, sign);
  }
}
