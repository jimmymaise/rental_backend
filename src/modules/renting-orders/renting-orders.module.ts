import { Module } from '@nestjs/common';

import { StoragesModule } from '../storages/storages.module';

import { RentingOrdersService } from './renting-orders.service';
import { RentingOrdersStatusService } from './renting-orders-status.service';
import { RentingOrderResolvers } from './renting-orders.resolvers';

import { CustomAttributesModule } from '@modules/custom-attributes/custom-attributes.module';
import { OrgActivityLogModule } from '@modules/org-activity-log';

@Module({
  imports: [CustomAttributesModule, StoragesModule, OrgActivityLogModule],
  providers: [
    RentingOrdersService,
    RentingOrdersStatusService,
    RentingOrderResolvers,
  ],
})
export class RentingOrderModule {}
