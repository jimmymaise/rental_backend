import { Module } from '@nestjs/common'

import { CategoriesService } from './categories.service'
import { CategoriessResolvers } from './categories.resolvers'

@Module({
  providers: [CategoriesService, CategoriessResolvers]
})
export class CategoriesModule {}
