import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import ActivityEntity from "src/database/entities/Activity";
import ImageActivityEntity from "src/database/entities/images/ImageActivity";
import ImageLocationEntity from "src/database/entities/images/ImageLocation";
import ImageReviewEntity from "src/database/entities/images/ImageReview";
import LocationEntity from "src/database/entities/Location";
import ReviewEntity from "src/database/entities/Review";
import { EnvList } from "src/enums/env";
import { Repository } from "typeorm";
import { v4 } from "uuid";
import { S3Service } from "./modules/s3/s3.service";

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageLocationEntity)
    private imageLocationRepository: Repository<ImageLocationEntity>,

    @InjectRepository(ImageReviewEntity)
    private imageReviewEntity: Repository<ImageReviewEntity>,

    @InjectRepository(ImageActivityEntity)
    private imageActivityEntity: Repository<ImageActivityEntity>,

    private s3Service: S3Service,

    private configService: ConfigService,
  ) {}

  private createImageInS3(id: string, file: FileUpload) {
    const writing = this.s3Service.createFile({
      Key: id,
      Bucket: this.configService.get<string>(EnvList.S3_BUCKET_NAME_IMAGES),
      ContentType: file.mimetype,
      ContentEncoding: file.encoding,
    });

    return new Promise<void>((resolve, reject) => {
      file
        .createReadStream()
        .pipe(writing.writeStream)
        .on("error", err => {
          reject(err);
        })
        .on("close", () => {
          resolve();
        });
    });
  }

  createImageLocation(location: LocationEntity, file: FileUpload): Promise<void> {
    const fileName = v4();

    location.images.push(this.imageLocationRepository.create({ id: fileName }));

    return this.createImageInS3(fileName, file);
  }

  createImageReview(review: ReviewEntity, file: FileUpload): Promise<void> {
    const fileName = v4();

    review.images.push(this.imageReviewEntity.create({ id: fileName }));

    return this.createImageInS3(fileName, file);
  }

  createImageActivity(activity: ActivityEntity, file: FileUpload): Promise<void> {
    const fileName = v4();

    activity.image = this.imageActivityEntity.create({ id: fileName });

    return this.createImageInS3(fileName, file);
  }

  getImage(id: string) {
    return this.s3Service.getFile({ Key: id, Bucket: this.configService.get<string>(EnvList.S3_BUCKET_NAME_IMAGES) });
  }
}
