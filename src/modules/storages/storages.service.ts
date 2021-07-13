import { Injectable } from '@nestjs/common';

import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { S3StorageService } from './aws-s3-storage.service';

import { PrismaService } from '../prisma/prisma.service';
import { FileStorage, FileUsingLocate } from '@prisma/client';

const DEFAULT_BUCKET_NAME =
  process.env.DEFAULT_BUCKET_NAME || 'asia-item-images';

@Injectable()
export class StoragesService {
  private cloudStorageService: GoogleCloudStorageService | S3StorageService;

  constructor(
    private prismaService: PrismaService,
    private googleStorageService: GoogleCloudStorageService,
    private s3StorageService: S3StorageService,
  ) {}

  public setCloudService(cloudName) {
    switch (cloudName) {
      case 'gc':
        this.cloudStorageService = this.googleStorageService;
        return this;
      case 'aws':
        this.cloudStorageService = this.s3StorageService;
        return this;
      default:
        throw Error('invalid cloud name');
    }
  }

  public getPublicUrl = (
    bucketName: string,
    folderName: string,
    fileName: string,
  ) => this.cloudStorageService.getPublicUrl(bucketName, folderName, fileName);

  public getImagePublicUrl(folderPath: string, fileName: string): string {
    return this.getPublicUrl(DEFAULT_BUCKET_NAME, folderPath, fileName);
  }

  public async generateReadSignedUrl(fileName: string): Promise<string> {
    return await this.cloudStorageService.getPreSignedUrlForDownload(
      fileName,
      DEFAULT_BUCKET_NAME,
    );
  }

  public generateUploadImageSignedUrl(
    fileName: string,
    contentType: string,
    size: number,
  ): Promise<string> {
    return this.cloudStorageService.getPreSignedUrlForUpload(
      fileName,
      contentType,
      size,
      DEFAULT_BUCKET_NAME,
    );
  }

  public async handleUploadImageBySignedUrlComplete(
    fileId: string,
    includes: string[] = [],
    makePublic?: boolean,
  ): Promise<FileStorage> {
    const fileDb = await this.prismaService.fileStorage.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!fileDb || fileDb.isUploadSuccess) {
      return fileDb;
    }

    if (makePublic) {
      try {
        await this.cloudStorageService.makePublic(
          fileDb.folderName,
          fileDb.name,
          fileDb.bucketName,
        );
      } catch (err) {}

      if (includes.includes('small')) {
        try {
          await this.cloudStorageService.makePublic(
            fileDb.folderName,
            `small-${fileDb.name}`,
            fileDb.bucketName,
          );
        } catch (err) {}
      }

      if (includes.includes('medium')) {
        try {
          await this.cloudStorageService.makePublic(
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
    return this.cloudStorageService.sendFileToCloudByStream(
      stream,
      filename,
      mimetype,
      DEFAULT_BUCKET_NAME,
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

  async saveItemImageStorageInfo({
    folderName,
    name,
    url,
    contentType,
    createdBy,
    orgId,
    fileSizes = [],
    usingLocate,
  }: {
    folderName: string;
    name: string;
    url: string;
    contentType: string;
    createdBy: string;
    orgId: string;
    fileSizes: string[];
    usingLocate: FileUsingLocate;
  }): Promise<FileStorage> {
    return this.prismaService.fileStorage.create({
      data: {
        url,
        name,
        contentType,
        bucketName: DEFAULT_BUCKET_NAME,
        folderName,
        createdBy,
        orgId,
        sizes: fileSizes,
        usingLocate,
      },
    });
  }

  async saveItemFileStorageInfo({
    folderName,
    name,
    url,
    contentType,
    createdBy,
    orgId,
    usingLocate,
  }: {
    folderName: string;
    name: string;
    url: string;
    contentType: string;
    createdBy: string;
    orgId: string;
    usingLocate: FileUsingLocate;
  }): Promise<FileStorage> {
    return this.prismaService.fileStorage.create({
      data: {
        url,
        name,
        contentType,
        bucketName: DEFAULT_BUCKET_NAME,
        folderName,
        createdBy,
        orgId,
        usingLocate,
      },
    });
  }

  public async generatePublicUrl(url): Promise<string> {
    // Extract, get signed url cho tung file
    const splitedUrl = url.split('/');
    const bucketName = DEFAULT_BUCKET_NAME;
    const fileName = splitedUrl[splitedUrl.length - 1];
    const folderName = splitedUrl[splitedUrl.length - 2];

    return this.cloudStorageService.getPreSignedUrlForDownload(
      `${folderName}/${fileName}`,
      bucketName,
    );
  }
}
