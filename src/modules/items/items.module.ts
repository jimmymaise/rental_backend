import { Module } from '@nestjs/common';

import { AuthModule } from '@modules/auth';
import { ItemsService } from './items.service';
import { UserItemsService } from './user-items.service';
import { AdminItemsService } from './admin-items.service';
import { ItemsResolvers } from './items.resolvers';
import { StoragesModule } from '../storages/storages.module';
import { UsersModule } from '../users/users.module';
import { SearchKeywordModule } from '../search-keyword/search-keyword.module';
import { WishingItemsModule } from '../wishing-items/wishing-items.module';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [
    RedisCacheModule,
    AuthModule,
    StoragesModule,
    UsersModule,
    SearchKeywordModule,
    WishingItemsModule,
  ],
  providers: [
    ItemsService,
    UserItemsService,
    AdminItemsService,
    ItemsResolvers,
  ],
})
export class ItemsModule {}
