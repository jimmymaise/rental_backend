import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageService } from '@modules/storages/storage.service.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({ region: 'REGION' });
  }


  public async getPreSignedUrlForUpload(
    fileName: string,
    contentType: string,
    size: number,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      ContentType: contentType,
      Body: undefined,
    };
    const command = new PutObjectCommand(params);
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  };

  public async getPreSignedUrlForDownload(
    fileName: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    // These options will allow temporary read access to the file

    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const command = new PutObjectCommand(params);
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: Date.now() + 15 * 60 * 1000, // 15 minutes,
    });

  }

  public async makePublic(
    folderName: string,
    fileName: string,
    bucketName: string,
  ): Promise<void> {
    throw new Error('not Implemented');
  }

  public sendFileToCloudByStream = (
    stream: any,
    filename: string,
    mimetype: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> => {
    throw new Error('not Implemented');
  };
  public getPublicUrl = (
    bucketName: string,
    folderName: string,
    fileName: string,
  ) => {
    throw new Error('not Implemented');
  };

}

export default S3StorageService;
