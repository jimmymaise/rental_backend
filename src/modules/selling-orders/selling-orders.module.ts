import { Module } from '@nestjs/common';

import { SellingOrdersService } from './selling-orders.service';
import { SellingOrderResolvers } from './selling-orders.resolvers';

import { CustomAttributesModule } from '@modules/custom-attributes/custom-attributes.module';

@Module({
  imports: [CustomAttributesModule],
  providers: [SellingOrdersService, SellingOrderResolvers],
})
export class SellingOrderModule {}
