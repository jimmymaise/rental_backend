import { Module } from '@nestjs/common';

import { WishingItemsService } from './wishing-items.service';
import { WishingItemsResolvers } from './wishing-items.resolvers';

@Module({
  providers: [WishingItemsService, WishingItemsResolvers],
})
export class WishingItemsModule {}