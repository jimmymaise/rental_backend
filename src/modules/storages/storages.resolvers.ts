import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import * as sharp from 'sharp'
import * as mime from 'mime-types'

import { StoragesService } from './storages.service'
import { GqlAuthGuard, CurrentUser, GuardUserPayload } from '../auth'
import { StorageDTO } from './storage.dto'

interface PreSignedImageUrlData {
  id: string
  preSignedUrl: string
  mediumPreSignedUrl: string
  smallPreSignedUrl: string
  imageUrl: string
}

@Resolver('Storage')
export class StoragesResolvers {
  constructor(private readonly storagesService: StoragesService) {}

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

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async uploadItemImage(
    @CurrentUser() user: GuardUserPayload,
    @Args('file') file: any
  ): Promise<StorageDTO> {
    const filename = Date.now() + '-' + file.filename
    const fileFullUrl = await this.storagesService.uploadItemImage(file.createReadStream(), filename, file.mimetype)
    const resizeOption = {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    }
    await this.storagesService.uploadItemImage(file.createReadStream().pipe(sharp().resize(400, 400, resizeOption)), `small-${filename}`, file.mimetype)
    await this.storagesService.uploadItemImage(file.createReadStream().pipe(sharp().resize(700, 700, resizeOption)), `medium-${filename}`, file.mimetype)
    const storageInfo = await this.storagesService.saveItemImageStorageInfo(file.filename, fileFullUrl, file.mimetype, user.id)

    return {
      id: storageInfo.id,
      url: storageInfo.url,
      name: storageInfo.name,
      bucketName: storageInfo.bucketName,
      folderName: storageInfo.folderName,
      contentType: storageInfo.contentType,
      createdBy: storageInfo.createdBy
    };
  }

  // Pre Generation Image File Signed URL for upload
  @Mutation()
  @UseGuards(GqlAuthGuard)
  async generateImageFile(
    @CurrentUser() user: GuardUserPayload,
    @Args('imageData') imageData: {
      name: string,
      contentType: string,
      includes: string[] // medium, small
    }
  ): Promise<PreSignedImageUrlData> {
    let smallPreSignedUrl
    let mediumPreSignedUrl

    const contentType = imageData.contentType
    
    const fileExtension = mime.extension(contentType)

    const fileName = `${user.id}/${Date.now()}-${Buffer.from(imageData.name.slice(0, 10)).toString('base64').toLowerCase()}-thue-do-vn.${fileExtension}`
    const fileFullUrl = this.storagesService.getImagePublicUrl(fileName)
    const storageInfo = await this.storagesService.saveItemImageStorageInfo(fileName, fileFullUrl, contentType, user.id)

    if (imageData.includes.includes('small')) {
      smallPreSignedUrl = await this.storagesService.generateUploadImageSignedUrl(`small-${fileName}`, contentType)
    }

    if (imageData.includes.includes('medium')) {
      mediumPreSignedUrl = await this.storagesService.generateUploadImageSignedUrl(`medium-${fileName}`, contentType)
    }

    const preSignedUrl = await this.storagesService.generateUploadImageSignedUrl(fileName, contentType)

    return {
      id: storageInfo.id,
      preSignedUrl,
      mediumPreSignedUrl,
      smallPreSignedUrl,
      imageUrl: fileFullUrl
    }
  }
}
