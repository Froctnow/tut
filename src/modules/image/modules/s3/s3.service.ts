import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AWS from "aws-sdk";
import { EnvList } from "src/enums/env";
import { PassThrough } from "stream";

@Injectable()
export class S3Service implements OnApplicationBootstrap {
  constructor(private configService: ConfigService) {}

  private storage: AWS.S3 = null;

  async onApplicationBootstrap() {
    try {
      const credentials = new AWS.Credentials({
        accessKeyId: this.configService.get<string>(EnvList.S3_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get<string>(EnvList.S3_SECRET_ACCESS_KEY),
      });

      this.storage = new AWS.S3({
        credentials,
        endpoint: this.configService.get<string>(EnvList.S3_ENDPOINT),
        sslEnabled: false,
        s3ForcePathStyle: true,
      });

      await new Promise((resolve, reject) => {
        this.storage.listBuckets((err, data) => {
          if (err) {
            reject(err);
          }

          if (!data.Buckets.find(bucket => bucket.Name === this.configService.get<string>(EnvList.S3_BUCKET_NAME_IMAGES))) {
            reject("Bucket for images doesn't exist");
            // this.storage.createBucket({ Bucket: "dev" }, (err, data) => {
            //   resolve(data);
            // });
          }

          resolve(data);
        });
      });
    } catch (error) {
      console.log(error);
      process.exit();
    }
  }

  createFile(params: AWS.S3.PutObjectRequest) {
    const pass = new PassThrough();

    params.Body = pass;

    const uploading = this.storage.upload(params).promise();

    return {
      writeStream: pass,
      uploading,
    };
  }

  getFile(params: AWS.S3.PutObjectRequest) {
    return this.storage.getObject(params).createReadStream();
  }
}
