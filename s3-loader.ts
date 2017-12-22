import { AWSError, S3 } from "aws-sdk";

export class S3Loader {
  private s3: S3;
  private bucketName;
  private key;

  constructor(options?: S3.Types.ClientConfiguration & { s3Options: { Bucket: string, Key: string } }) {
    this.s3 = new S3(options || {
      region: "ap-southeast-1",
    });
    this.bucketName = options.s3Options.Bucket;
    this.key = options.s3Options.Key;
  }

  protected getImageFromS3(): Promise<S3.Types.GetObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.getObject({
        Bucket: this.bucketName,
        Key: this.key,
      }, (err: AWSError, data: S3.Types.GetObjectOutput) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}