import { Module } from '@nestjs/common';

import { AuthModule } from '@modules/auth';
import { ItemsService } from './items.service';
import { UserItemsService } from './user-items.service';
import { ItemsResolvers } from './items.resolvers';
import { StoragesModule } from '../storages/storages.module';
import { UsersModule } from '../users/users.module';
import { SearchKeywordModule } from '../search-keyword/search-keyword.module';
import { WishingItemsModule } from '../wishing-items/wishing-items.module';

@Module({
  imports: [
    AuthModule,
    StoragesModule,
    UsersModule,
    SearchKeywordModule,
    WishingItemsModule,
  ],
  providers: [ItemsService, UserItemsService, ItemsResolvers],
})
export class ItemsModule {}
