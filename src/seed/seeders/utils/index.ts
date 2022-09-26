import fs from "fs";
import { PassThrough } from "stream";
import AWS from "aws-sdk";

async function createImage(readStream: fs.ReadStream, key: string, storage: AWS.S3): Promise<void> {
  await new Promise((res, rej) => {
    const pass = new PassThrough();
    const params: AWS.S3.PutObjectRequest = {
      Key: key,
      Bucket: process.env.S3_BUCKET_NAME_IMAGES,
      Body: pass,
    };

    res(storage.upload(params).promise());

    readStream
      .pipe(pass)
      .on("error", err => {
        rej(err);
      })
      .on("close", () => {
        res("");
      });
  });
}

const credentials = new AWS.Credentials({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const storage = new AWS.S3({
  credentials,
  endpoint: process.env.S3_ENDPOINT,
  sslEnabled: false,
  s3ForcePathStyle: true,
});

export { createImage, storage };
