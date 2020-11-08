import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { StoragesService } from './storages.service'

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

  @Mutation(() => Boolean)
  async uploadItemImage(
    @Args('file') file: any
  ): Promise<boolean> {
    console.log('aaa', file)
    const result = await this.storagesService.uploadItemImage(file.createReadStream(), file.name)
    console.log('ooo', result)
    return false;
  }
}
