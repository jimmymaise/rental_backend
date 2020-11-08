import { Module } from '@nestjs/common'

import { StoragesService } from './storages.service'
import { StoragesResolvers } from './storages.resolvers'

@Module({
  providers: [StoragesService, StoragesResolvers]
})
export class StoragesModule {}
