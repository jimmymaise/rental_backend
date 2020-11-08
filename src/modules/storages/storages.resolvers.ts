import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql';

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
    const fileFullUrl = await this.storagesService.uploadItemImage(file.createReadStream(), file)
    const storageInfo = await this.storagesService.saveItemImageStorageInfo(file.filename, fileFullUrl, file.mimetype, user.userId)

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
}
