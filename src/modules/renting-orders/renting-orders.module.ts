import { Module } from '@nestjs/common';

import { StoragesModule } from '../storages/storages.module';

import { RentingOrdersService } from './renting-orders.service';
import { RentingOrdersStatusService } from './renting-orders-status.service';
import { CustomerRentingOrdersService } from './customer-renting-orders.service';
import { RentingOrderResolvers } from './renting-orders.resolvers';

import { CustomAttributesModule } from '@modules/custom-attributes/custom-attributes.module';
import { OrgActivityLogModule } from '@modules/org-activity-log';
import { OrgStatisticsModule } from '@modules/org-statistics';
import { OrganizationsModule } from '@modules/organizations';

@Module({
  imports: [
    CustomAttributesModule,
    StoragesModule,
    OrgActivityLogModule,
    OrgStatisticsModule,
    OrganizationsModule,
  ],
  providers: [
    RentingOrdersService,
    RentingOrdersStatusService,
    CustomerRentingOrdersService,
    RentingOrderResolvers,
  ],
})
export class RentingOrderModule {}
