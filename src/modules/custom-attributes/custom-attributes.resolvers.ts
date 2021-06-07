import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { CustomAttributesService } from './custom-attributes.service';
import {
  RentingOrderStatusModel,
  RentingOrderStatusCreateModel,
  RentingDepositItemStatusModel,
  RentingDepositItemStatusCreateModel,
  RentingDepositItemTypeCreateModel,
  RentingDepositItemTypeModel,
} from './models';

@Resolver('CustomAttributes')
export class CustomAttributesResolvers {
  constructor(private customAttributeService: CustomAttributesService) {}

  // Selling Order Status
  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllRentingOrderStatusCustomAttributes(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<RentingOrderStatusModel[]> {
    return this.customAttributeService.getAllRentingOrderStatusCustomAttributes(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemRentingOrderStatusCustomAttributes(): Promise<
    RentingOrderStatusModel[]
  > {
    return this.customAttributeService.getAllSystemRentingOrderStatus();
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async createRentingOrderStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderStatusCreateModel,
  ): Promise<RentingOrderStatusModel> {
    return this.customAttributeService.createRentingOrderStatusCustomAttribute(
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async updateRentingOrderStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('data') data: RentingOrderStatusCreateModel,
  ): Promise<RentingOrderStatusModel> {
    return this.customAttributeService.updateRentingOrderStatusCustomAttribute(
      value,
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async deleteRentingOrderStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<RentingOrderStatusModel> {
    return this.customAttributeService.deleteRentingOrderStatusCustomAttribute(
      value,
      user.currentOrgId,
      type,
    );
  }

  // Renting Deposit Item Status
  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllRentingDepositItemStatusCustomAttributes(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<RentingDepositItemStatusModel[]> {
    return this.customAttributeService.getAllRentingDepositItemStatusCustomAttributes(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemRentingDepositItemStatusCustomAttributes(): Promise<
    RentingDepositItemStatusModel[]
  > {
    return this.customAttributeService.getAllSystemRentingDepositItemStatus();
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async createRentingDepositItemStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingDepositItemStatusCreateModel,
  ): Promise<RentingDepositItemStatusModel> {
    return this.customAttributeService.createRentingDepositItemStatusCustomAttribute(
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async updateRentingDepositItemStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('data') data: RentingDepositItemStatusCreateModel,
  ): Promise<RentingDepositItemStatusModel> {
    return this.customAttributeService.updateRentingDepositItemStatusCustomAttribute(
      value,
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async deleteRentingDepositItemStatusCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<RentingDepositItemStatusModel> {
    return this.customAttributeService.deleteRentingDepositItemStatusCustomAttribute(
      value,
      user.currentOrgId,
      type,
    );
  }

  // Renting Deposit Item Type
  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllRentingDepositItemTypeCustomAttributes(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<RentingDepositItemTypeModel[]> {
    return this.customAttributeService.getAllRentingDepositItemTypeCustomAttributes(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemRentingDepositItemTypeCustomAttributes(): Promise<
    RentingDepositItemTypeModel[]
  > {
    return this.customAttributeService.getAllSystemRentingDepositItemType();
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async createRentingDepositItemTypeCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingDepositItemTypeCreateModel,
  ): Promise<RentingDepositItemTypeModel> {
    return this.customAttributeService.createRentingDepositItemTypeCustomAttribute(
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async updateRentingDepositItemTypeCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('data') data: RentingDepositItemTypeCreateModel,
  ): Promise<RentingDepositItemTypeModel> {
    return this.customAttributeService.updateRentingDepositItemTypeCustomAttribute(
      value,
      user.currentOrgId,
      user.id,
      data,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async deleteRentingDepositItemTypeCustomAttribute(
    @CurrentUser() user: GuardUserPayload,
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<RentingDepositItemTypeModel> {
    return this.customAttributeService.deleteRentingDepositItemTypeCustomAttribute(
      value,
      user.currentOrgId,
      type,
    );
  }
}
