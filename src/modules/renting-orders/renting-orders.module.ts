import { Module } from '@nestjs/common';

import { StoragesModule } from '../storages/storages.module';

import { RentingOrdersService } from './renting-orders.service';
import { RentingOrdersStatusService } from './renting-orders-status.service';
import { RentingOrderResolvers } from './renting-orders.resolvers';

import { CustomAttributesModule } from '@modules/custom-attributes/custom-attributes.module';

@Module({
  imports: [CustomAttributesModule, StoragesModule],
  providers: [
    RentingOrdersService,
    RentingOrdersStatusService,
    RentingOrderResolvers,
  ],
})
export class RentingOrderModule {}
