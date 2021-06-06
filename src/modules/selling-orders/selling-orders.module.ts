import { Module } from '@nestjs/common';

import { StoragesModule } from '../storages/storages.module';

import { SellingOrdersService } from './selling-orders.service';
import { SellingOrdersStatusService } from './selling-orders-status.service';
import { SellingOrderResolvers } from './selling-orders.resolvers';

import { CustomAttributesModule } from '@modules/custom-attributes/custom-attributes.module';

@Module({
  imports: [CustomAttributesModule, StoragesModule],
  providers: [
    SellingOrdersService,
    SellingOrdersStatusService,
    SellingOrderResolvers,
  ],
})
export class SellingOrderModule {}
