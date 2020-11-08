import { Module } from '@nestjs/common'

import { CategoriesService } from './categories.service'
import { CategoriesResolvers } from './categories.resolvers'

@Module({
  providers: [CategoriesService, CategoriesResolvers]
})
export class CategoriesModule {}
