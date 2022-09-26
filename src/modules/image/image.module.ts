import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ImageActivityEntity from "src/database/entities/images/ImageActivity";
import ImageCategoryEntity from "src/database/entities/images/ImageCategory";
import ImageLocationEntity from "src/database/entities/images/ImageLocation";
import ImageReviewEntity from "src/database/entities/images/ImageReview";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { S3Module } from "./modules/s3/s3.module";

@Module({
  imports: [TypeOrmModule.forFeature([ImageLocationEntity, ImageReviewEntity, ImageActivityEntity, ImageCategoryEntity]), S3Module],
  providers: [ImageService],
  controllers: [ImageController],
  exports: [TypeOrmModule.forFeature([ImageLocationEntity, ImageReviewEntity, ImageActivityEntity, ImageCategoryEntity]), ImageService],
})
export class ImageModule {}
