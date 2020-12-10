import { Module } from '@nestjs/common'

import { RedisCacheModule } from '../redis-cache/redis-cache.module'

import { UsersService } from './users.service'
import { StoragesModule } from '../storages/storages.module'
import { UsersResolvers } from './users.resolvers'

@Module({
  imports: [StoragesModule, RedisCacheModule],
  providers: [UsersService, UsersResolvers],
  exports: [UsersService]
})
export class UsersModule {}
