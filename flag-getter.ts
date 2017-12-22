import { S3 } from "aws-sdk";
import { S3Loader } from "./s3-loader";

const dotenv = require("dotenv");

export class FlagGetter extends S3Loader {
  private expire: number;
  private expiration: number = Date.now();
  private data: any;

  constructor(options?: S3.Types.ClientConfiguration & { s3Options: { expire?: number, Bucket: string, Key: string } }) {
    super(options);
    this.expire = (options.s3Options.expire || 60 * 60) * 1000;
  }

  public async getFlag() {
    if (this.expiration < Date.now()) {
      try {
        this.data = await this.transformFlagFileToObject();
        this.expiration = Date.now() + this.expire;
      } catch (e) {
      }
    }
    return this.data;
  }

  private transformFlagFileToObject(): Promise<object> {
    return this.getImageFromS3().then((data: S3.Types.GetObjectOutput) => dotenv.parse(data.Body));
  }
}