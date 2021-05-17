import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { CustomAttributesService } from './custom-attributes.service';
import {
  SellingOrderStatusModel,
  SellingOrderStatusCreateModel,
  RentingOrderItemStatusCreateModel,
  RentingOrderItemStatusModel,
} from './models';

@Resolver('CustomAttributes')
export class CustomAttributesResolvers {
  constructor(private customAttributeService: CustomAttributesService) {}

  // Selling Order Status
  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSellingOrderStatusCustomAttributes(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<SellingOrderStatusModel[]> {
    return this.customAttributeService.getAllSellingOrderStatusCustomAttributes(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemSellingOrderStatusCustomAttributes(): Promise<
    SellingOrderStatusModel[]
  > {
    return this.customAttributeService.getAllSystemSellingOrderStatus();
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async createSellingOrderStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: SellingOrderStatusCreateModel,
  ): Promise<SellingOrderStatusModel> {
    return this.customAttributeService.createSellingOrderStatusCustomAttribute(
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async updateSellingOrderStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('data') data: SellingOrderStatusCreateModel,
  ): Promise<SellingOrderStatusModel> {
    return this.customAttributeService.updateSellingOrderStatusCustomAttribute(
      value,
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async deleteSellingOrderStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<SellingOrderStatusModel> {
    return this.customAttributeService.deleteSellingOrderStatusCustomAttribute(
      value,
      user.currentOrgId,
      type,
    );
  }

  // Renting Order Item Status
  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllRentingOrderItemStatusCustomAttributes(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<RentingOrderItemStatusModel[]> {
    return this.customAttributeService.getAllRentingOrderItemStatusCustomAttributes(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemRentingOrderItemStatusCustomAttributes(): Promise<
    RentingOrderItemStatusModel[]
  > {
    return this.customAttributeService.getAllSystemRentingOrderItemStatus();
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async createRentingOrderItemStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderItemStatusCreateModel,
  ): Promise<RentingOrderItemStatusModel> {
    return this.customAttributeService.createRentingOrderItemStatusCustomAttribute(
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async updateRentingOrderItemStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('data') data: RentingOrderItemStatusCreateModel,
  ): Promise<RentingOrderItemStatusModel> {
    return this.customAttributeService.updateRentingOrderItemStatusCustomAttribute(
      value,
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async deleteRentingOrderItemStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<RentingOrderItemStatusModel> {
    return this.customAttributeService.deleteRentingOrderItemStatusCustomAttribute(
      value,
      user.currentOrgId,
      type,
    );
  }
}
