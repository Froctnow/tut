import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import EstimationEntity from "src/database/entities/Estimation";
import ReviewEntity from "src/database/entities/Review";
import { ESModule } from "src/elastic_search/ES.module";
import { ImageModule } from "src/modules/image/image.module";
import { LocationModule } from "../../location.module";
import { ReviewResolver } from "./review.resolvers";
import { ReviewService } from "./review.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, EstimationEntity]), ImageModule, ESModule, forwardRef(() => LocationModule)],
  providers: [ReviewResolver, ReviewService],
})
export class ReviewModule {}
