import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { SellingOrdersService } from './selling-orders.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { SellingOrderCreateModel } from './models/selling-order-create.model';
import { SellingOrderModel } from './models/selling-order.model';

@Resolver('SellingOrder')
export class SellingOrderResolvers {
  constructor(private readonly sellingOrdersService: SellingOrdersService) {}

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async createSellingOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: SellingOrderCreateModel,
  ): Promise<SellingOrderModel> {
    return this.sellingOrdersService.createRentingOrder({
      creatorId: user.id,
      orgId: user.currentOrgId,
      data,
    });
  }
}
