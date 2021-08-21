import IStorageProvider from '../models/IStorageProvider';
import { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;
  constructor() {
    this.client = new S3({
      region: process.env.AWS_REGION,
    });
  }
  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const fileContent = await fs.readFile(originalPath);

    const ContentType = mime.lookup(originalPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Key: file,
        Bucket: uploadConfig.aws.bucket,
      })
      .promise();
  }
}
