import { Module } from '@nestjs/common';

import { WishingItemsService } from './wishing-items.service';
import { WishingItemsResolvers } from './wishing-items.resolvers';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [WishingItemsService, WishingItemsResolvers],
  exports: [WishingItemsService],
})
export class WishingItemsModule {}
