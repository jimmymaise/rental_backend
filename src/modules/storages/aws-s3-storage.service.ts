import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import isEmpty from 'lodash/isEmpty';
import {
  S3Client,
  PutObjectCommand,
  PutObjectAclCommand,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageService } from '@modules/storages/storage.service.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
    });
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
      expiresIn: 900,
    });
  }

  public async getPreSignedUrlForDownload(
    filePath: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    // These options will allow temporary read access to the file

    const params: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 900, // 15 minutes,
    });
  }

  public getPublicUrl = (
    bucketName: string,
    folderPath: string,
    fileName: string,
  ) =>
    process.env.AWS_S3_HOST === '-'
      ? `https://${bucketName}/${folderPath}/${fileName}`
      : `https://${bucketName}.${process.env.AWS_S3_HOST}/${folderPath}/${fileName}`;

  public sendFileToCloudByStream = (
    stream: any,
    filePath: string,
    mimetype: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> => {
    throw new Error('not Implemented');
  };

  public async makePublic(
    folderPath: string,
    fileName: string,
    bucketName: string,
  ): Promise<void> {
    const filePath = `${folderPath}/${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: filePath,
      ACL: 'public-read',
    };

    const command = new PutObjectAclCommand(params);
    await this.s3Client.send(command);
  }
}

export default S3StorageService;
