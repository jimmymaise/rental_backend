import { Module } from '@nestjs/common'

import { ItemsService } from './items.service'
import { UserItemsService } from './user-items.service'
import { ItemsResolvers } from './items.resolvers'
import { StoragesModule } from '../storages/storages.module'

@Module({
  imports: [StoragesModule],
  providers: [ItemsService, UserItemsService, ItemsResolvers]
})
export class ItemsModule {}
