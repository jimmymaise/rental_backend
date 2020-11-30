import { Injectable } from '@nestjs/common';

import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { FileStorage, FileUsingLocate } from '@prisma/client';

const BUCKET_ITEM_IMAGE_NAME =
  process.env.BUCKET_ITEM_IMAGE_NAME || 'asia-item-images';

@Injectable()
export class StoragesService {
  constructor(
    private prismaService: PrismaService,
    private googleStorageService: GoogleCloudStorageService
  ) {}

  public getPublicUrl = (bucketName: string, fileName: string) => this.googleStorageService.getPublicUrl(bucketName, fileName)

  public getImagePublicUrl(fileName: string): string {
    return this.getPublicUrl(BUCKET_ITEM_IMAGE_NAME, fileName)
  }

  public generateUploadImageSignedUrl(fileName: string, contentType: string): Promise<string> {
    return this.googleStorageService.getPreSignedUrlForUpload(fileName, contentType, BUCKET_ITEM_IMAGE_NAME)
  }

  public uploadItemImage(stream: any, filename: string, mimetype: string): Promise<string> {
    return this.googleStorageService.sendFileToGCSByStream(
      stream,
      filename,
      mimetype,
      BUCKET_ITEM_IMAGE_NAME,
    );
  }

  async saveItemImageStorageInfo(
    name: string,
    url: string,
    contentType: string,
    createdBy: string,
  ): Promise<FileStorage> {
    return this.prismaService.fileStorage.create({
      data: {
        url,
        name,
        contentType,
        bucketName: BUCKET_ITEM_IMAGE_NAME,
        folderName: '',
        createdBy,
        usingLocate: FileUsingLocate.ItemPreviewImage
      },
    });
  }
}
