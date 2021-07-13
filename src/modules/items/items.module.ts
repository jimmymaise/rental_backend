import { Module } from '@nestjs/common';

import { AuthModule } from '@modules/auth';
import { ItemsService } from './items.service';
import { UserItemsService } from './user-items.service';
import { AdminItemsService } from './admin-items.service';
import { OrgItemsService } from './org-items.service';
import { ItemsResolvers } from './items.resolvers';
import { StoragesModule } from '../storages/storages.module';
import { UsersModule } from '../users/users.module';
import { SearchKeywordModule } from '../search-keyword/search-keyword.module';
import { WishingItemsModule } from '../wishing-items/wishing-items.module';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { OrgActivityLogModule } from '@modules/org-activity-log/org-activity-log.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    RedisCacheModule,
    AuthModule,
    StoragesModule,
    UsersModule,
    SearchKeywordModule,
    WishingItemsModule,
    OrgActivityLogModule,
    OrganizationsModule,
  ],
  providers: [
    ItemsService,
    UserItemsService,
    AdminItemsService,
    ItemsResolvers,
    OrgItemsService,
  ],
})
export class ItemsModule {}
