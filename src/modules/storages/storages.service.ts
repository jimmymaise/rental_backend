import { Injectable } from '@nestjs/common';

import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { FileStorage, FileUsingLocate } from '@prisma/client';

const BUCKET_ITEM_IMAGE_NAME =
  process.env.BUCKET_ITEM_IMAGE_NAME || 'asia-item-images';

@Injectable()
export class StoragesService {
  constructor(private prismaService: PrismaService) {}

  public uploadItemImage(stream: any, fileData: any): Promise<string> {
    return GoogleCloudStorageService.sendFileToGCSByStream(
      stream,
      fileData,
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
