import { Module } from '@nestjs/common'

import { ItemsService } from './items.service'
import { ItemsResolvers } from './items.resolvers'

@Module({
  providers: [ItemsService, ItemsResolvers]
})
export class ItemsModule {}
