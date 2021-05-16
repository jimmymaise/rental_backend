import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  PutBucketAclCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageService } from '@modules/storages/storage.service.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({ region: 'REGION' });
  }

  public async getPreSignedUrlForUpload(
    filePath: string,
    contentType: string,
    size: number,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: filePath,
      ContentType: contentType,
      Body: undefined,
    };
    const command = new PutObjectCommand(params);
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  }

  public async getPreSignedUrlForDownload(
    filePath: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    // These options will allow temporary read access to the file

    const params = {
      Bucket: bucketName,
      Key: filePath,
    };

    const command = new PutObjectCommand(params);
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: Date.now() + 15 * 60 * 1000, // 15 minutes,
    });
  }

  public getPublicUrl = (
    bucketName: string,
    folderPath: string,
    fileName: string,
  ) => `${process.env.AWS_S3_HOST}${bucketName}/${folderPath}/${fileName}`;

  public sendFileToCloudByStream = (
    stream: any,
    filePath: string,
    mimetype: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> => {
    throw new Error('not Implemented');
  };

  public async makePublic(filePath: string, bucketName: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: filePath,
      ACL: 'public-read',
    };
    const command = new PutBucketAclCommand(params);
    await this.s3Client.send(command);
  }
}

export default S3StorageService;
