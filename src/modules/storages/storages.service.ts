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
    private googleStorageService: GoogleCloudStorageService,
  ) {}

  public getPublicUrl = (
    bucketName: string,
    folderName: string,
    fileName: string,
  ) => this.googleStorageService.getPublicUrl(bucketName, folderName, fileName);

  public getImagePublicUrl(folderName: string, fileName: string): string {
    return this.getPublicUrl(BUCKET_ITEM_IMAGE_NAME, folderName, fileName);
  }

  public async generateReadSignedUrl(fileName: string): Promise<string> {
    return await this.googleStorageService.generateV4ReadSignedUrl(
      fileName,
      BUCKET_ITEM_IMAGE_NAME,
    );
  }

  public generateUploadImageSignedUrl(
    fileName: string,
    contentType: string,
    size: number
  ): Promise<string> {
    return this.googleStorageService.getPreSignedUrlForUpload(
      fileName,
      contentType,
      size,
      BUCKET_ITEM_IMAGE_NAME,
    );
  }

  public async getReadSignedUrlForUrl(
    originalUrl: string,
    includes: string[] = [],
  ) {
    // Extract, get signed url cho tung file
    const splitedUrl = originalUrl.split('/');
    const bucketName = BUCKET_ITEM_IMAGE_NAME;
    const fileName = splitedUrl[splitedUrl.length - 1];
    const folderName = splitedUrl[splitedUrl.length - 2];

    let url;
    let smallUrl;
    let mediumUrl;

    try {
      url = await this.googleStorageService.generateV4ReadSignedUrl(
        `${folderName}/${fileName}`,
        bucketName,
      );
    } catch (err) {}

    if (includes.includes('small')) {
      try {
        smallUrl = await this.googleStorageService.generateV4ReadSignedUrl(
          `${folderName}/small-${fileName}`,
          bucketName,
        );
      } catch (err) {}
    }

    if (includes.includes('medium')) {
      try {
        mediumUrl = await this.googleStorageService.generateV4ReadSignedUrl(
          `${folderName}/medium-${fileName}`,
          bucketName,
        );
      } catch (err) {}
    }

    return {
      url,
      smallUrl,
      mediumUrl,
    };
  }

  public async handleUploadImageBySignedUrlComplete(
    fileId: string,
    includes: string[] = [],
  ): Promise<FileStorage> {
    const fileDb = await this.prismaService.fileStorage.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!fileDb || fileDb.isUploadSuccess) {
      return fileDb;
    }

    if (fileDb) {
      try {
        await this.googleStorageService.makePublic(
          fileDb.folderName,
          fileDb.name,
          fileDb.bucketName,
        );
      } catch (err) {}

      if (includes.includes('small')) {
        try {
          await this.googleStorageService.makePublic(
            fileDb.folderName,
            `small-${fileDb.name}`,
            fileDb.bucketName,
          );
        } catch (err) {}
      }

      if (includes.includes('medium')) {
        try {
          await this.googleStorageService.makePublic(
            fileDb.folderName,
            `medium-${fileDb.name}`,
            fileDb.bucketName,
          );
        } catch (err) {}
      }
    }

    const updatedFileDb = await this.prismaService.fileStorage.update({
      where: {
        id: fileId,
      },
      data: {
        isUploadSuccess: true,
      },
    });

    return updatedFileDb;
  }

  public uploadItemImage(
    stream: any,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    return this.googleStorageService.sendFileToGCSByStream(
      stream,
      filename,
      mimetype,
      BUCKET_ITEM_IMAGE_NAME,
    );
  }

  async getFileDataById(fileId: string): Promise<FileStorage> {
    return this.prismaService.fileStorage.findUnique({ where: { id: fileId } });
  }

  async hardDeleteFile(fileId: string): Promise<FileStorage> {
    return this.prismaService.fileStorage.delete({ where: { id: fileId } });
  }

  async softDeleteFile(fileId: string): Promise<FileStorage> {
    return this.prismaService.fileStorage.update({
      where: { id: fileId },
      data: { isDeleted: true },
    });
  }

  async saveItemImageStorageInfo(
    folderName: string,
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
        folderName,
        createdBy,
        usingLocate: FileUsingLocate.ItemPreviewImage,
      },
    });
  }
}
