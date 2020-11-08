import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver('Storage')
export class StoragesResolvers {
  @Mutation()
  // async uploadItemImage(@Args({name: 'file', type: () => GraphQLUpload}): Promise<any> {
  //   console.log('dddd', file)
  //   const { stream, filename, mimetype, encoding } = await file;
  //   return { filename, mimetype, encoding };
  // }
  async uploadItemImage(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<any> {
    return { filename };
  }
}
