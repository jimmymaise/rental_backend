import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import * as sharp from 'sharp'

import { StoragesService } from './storages.service'
import { GqlAuthGuard, CurrentUser, GuardUserPayload } from '../auth'
import { StorageDTO } from './storage.dto'

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

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async generateUploadImageSignedUrl(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<String> {
    return this.storagesService.generateUploadImageSignedUrl()
  }
}
