import { UseGuards, BadRequestException } from '@nestjs/common';
import { Args, Info, Mutation, Resolver, Query } from '@nestjs/graphql';
// import * as sharp from 'sharp'
import * as mime from 'mime-types';
import { FileUsingLocate } from '@prisma/client';

import { StoragesService } from './storages.service';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { GuardUserPayload } from '../auth/auth.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { ImagePreSignedUploadInput } from './storage.dto';
import { ErrorMap } from '@app/constants';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GraphQLResolveInfo } from 'graphql';
import {
  FilePreSignedUploadRequestModel,
  FilePreSignedUploadResultModel,
} from './models';

interface PreSignedImageUrlData {
  id: string;
  preSignedUrl: string;
  mediumPreSignedUrl: string;
  smallPreSignedUrl: string;
  imageUrl: string;
}

@Resolver('Storage')
export class StoragesResolvers {
  constructor(
    private storagesService: StoragesService,
    private googleStorageService: GoogleCloudStorageService,
  ) {}

  // @Mutation(() => Boolean)
  // async uploadItemImage(
  //   @Args({ name: 'file', type: () => GraphQLUpload })
  //   fileUploadData: FileUpload,
  // ): Promise<boolean> {
  //   console.log('aaa', fileUploadData)
  //   return new Promise(async (resolve, reject) =>
  //     {
  //       return fileUploadData.createReadStream()
  //       .pipe(createWriteStream(`./uploads/${fileUploadData.filename}`))
  //       .on('finish', () => resolve(true))
  //       .on('error', () => reject(false))
  //     }
  //   );
  // }

  // @Mutation()
  // @UseGuards(GqlAuthGuard)
  // async uploadItemImage(
  //   @CurrentUser() user: GuardUserPayload,
  //   @Args('file') file: any
  // ): Promise<StorageDTO> {
  //   const filename = Date.now() + '-' + file.filename
  //   const fileFullUrl = await this.storagesService.uploadItemImage(file.createReadStream(), filename, file.mimetype)
  //   const resizeOption = {
  //     fit: sharp.fit.inside,
  //     withoutEnlargement: true
  //   }
  //   await this.storagesService.uploadItemImage(file.createReadStream().pipe(sharp().resize(400, 400, resizeOption)), `small-${filename}`, file.mimetype)
  //   await this.storagesService.uploadItemImage(file.createReadStream().pipe(sharp().resize(700, 700, resizeOption)), `medium-${filename}`, file.mimetype)
  //   const storageInfo = await this.storagesService.saveItemImageStorageInfo(file.filename, fileFullUrl, file.mimetype, user.id)

  //   return {
  //     id: storageInfo.id,
  //     url: storageInfo.url,
  //     name: storageInfo.name,
  //     bucketName: storageInfo.bucketName,
  //     folderName: storageInfo.folderName,
  //     contentType: storageInfo.contentType,
  //     createdBy: storageInfo.createdBy
  //   };
  // }

  // Pre Generation Image File Signed URL for upload

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async generateImageFile(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('imageData')
    imageData: ImagePreSignedUploadInput,
  ): Promise<PreSignedImageUrlData> {
    const cloudName = imageData['cloudName'] || 'gc';
    this.storagesService.setCloudService(cloudName);

    const contentType = imageData.contentType;
    const fileSizeMap = imageData.fileSizeMap;

    const OneMb = 1000000;
    for (const key of Object.keys(fileSizeMap)) {
      if (fileSizeMap[key] > OneMb) {
        throw new BadRequestException(ErrorMap.FILE_TOO_BIG);
      }
    }

    const fileExtension = mime.extension(contentType);

    const folderName = user.currentOrgId || user.id;
    const fileNamePaths = imageData.name.split('.');
    const fileName = `${Date.now()}-${encodeURIComponent(
      fileNamePaths[0],
    )}.${fileExtension}`;
    const fileFullUrl = this.storagesService.getImagePublicUrl(
      folderName,
      fileName,
    );
    const storageInfo = await this.storagesService.saveItemImageStorageInfo({
      folderName,
      name: fileName,
      url: fileFullUrl,
      contentType,
      createdBy: user.id,
      orgId: user.currentOrgId,
      fileSizes: imageData['includes'],
      usingLocate: imageData.usingLocate,
    });
    const imagePreSignedUrl = {};
    for (const type of imageData['includes']) {
      imagePreSignedUrl[
        type
      ] = await this.storagesService.generateUploadImageSignedUrl(
        `${folderName}/${type}-${fileName}`,
        contentType,
        fileSizeMap[type],
      );
    }

    return {
      id: storageInfo.id,
      preSignedUrl: imagePreSignedUrl['original'],
      mediumPreSignedUrl: imagePreSignedUrl['medium'],
      smallPreSignedUrl: imagePreSignedUrl['small'],
      imageUrl: fileFullUrl,
    };
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async deleteFileForListingItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('fileId') fileId: string,
  ): Promise<string> {
    const fileData = await this.storagesService.getFileDataById(fileId);
    if (fileData.createdBy !== user.id || fileData.isDeleted) {
      throw new Error('File does not exist');
    }

    if (fileData.usingLocate !== FileUsingLocate.ItemPreviewImage) {
      throw new Error('File does not exist');
    }

    this.storagesService.hardDeleteFile(fileId);
    try {
      this.googleStorageService.deleteFile(
        fileData.folderName,
        fileData.name,
        fileData.bucketName,
      );
    } catch {}

    try {
      this.googleStorageService.deleteFile(
        fileData.folderName,
        `small-${fileData.name}`,
        fileData.bucketName,
      );
    } catch {}

    try {
      this.googleStorageService.deleteFile(
        fileData.folderName,
        `medium-${fileData.name}`,
        fileData.bucketName,
      );
    } catch {}

    return fileId;
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async requestUploadFile(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('fileData')
    fileData: FilePreSignedUploadRequestModel,
  ): Promise<FilePreSignedUploadResultModel> {
    this.storagesService.setCloudService('aws');

    const contentType = fileData.contentType;
    const fileSize = fileData.size;

    const OneMb = 1000000;
    if (fileSize > OneMb) {
      throw new BadRequestException(ErrorMap.FILE_TOO_BIG);
    }

    const fileExtension = mime.extension(contentType);

    const folderName = user.currentOrgId || user.id;
    const fileNamePaths = fileData.name.split('.');
    const fileName = `${Date.now()}-${fileNamePaths[0].replace(
      /[^a-zA-Z0-9]/g,
      '-',
    )}.${fileExtension}`;
    const fileFullUrl = this.storagesService.getImagePublicUrl(
      folderName,
      fileName,
    );
    const storageInfo = await this.storagesService.saveItemFileStorageInfo({
      folderName,
      name: fileName,
      url: fileFullUrl,
      contentType,
      createdBy: user.id,
      orgId: user.currentOrgId,
      usingLocate: fileData.usingLocate,
    });

    const preSignedUrl = await this.storagesService.generateUploadImageSignedUrl(
      `${folderName}/${fileName}`,
      contentType,
      fileSize,
    );

    return {
      id: storageInfo.id,
      preSignedUrl,
      url: fileFullUrl,
    };
  }

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async generatePublicUrl(
    @Args('url')
    url: string,
  ): Promise<string> {
    this.storagesService.setCloudService('aws');

    return this.storagesService.generatePublicUrl(url);
  }
}
