import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { QueryWithOffsetPagingDTO } from '@app/models';
import { RentingOrdersService } from './renting-orders.service';
import { RentingOrdersStatusService } from './renting-orders-status.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { RentingOrderCreateModel, AddItemToOrderBagModel } from './models';
import { RentingOrderUpdateStatusModel } from './models/renting-order-update-status.model';
import { RentingOrderModel } from './models/renting-order.model';
import { RentingOrderItemModel } from './models/renting-order-item.model';
import { OffsetPaginationDTO } from '../../models';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';
import { CustomerRentingOrdersService } from './customer-renting-orders.service';

@Resolver('RentingOrder')
export class RentingOrderResolvers {
  constructor(
    private readonly rentingOrdersService: RentingOrdersService,
    private rentingOrdersStatusService: RentingOrdersStatusService,
    private orgActivityLogService: OrgActivityLogService,
    private customerRentingOrdersService: CustomerRentingOrdersService,
  ) {}

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async createRentingOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: RentingOrderCreateModel,
  ): Promise<RentingOrderModel> {
    const result = await this.rentingOrdersService.createRentingOrder({
      creatorId: user.id,
      orgId: user.currentOrgId,
      data,
    });

    await this.orgActivityLogService.logCreateNewRentingOrder({
      createdBy: user.id,
      orgId: user.currentOrgId,
      rentingOrderId: result.id,
      data: {
        rentingOrderId: result.id,
        orderCustomId: result.orderCustomId,
      },
    });

    return result;
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async updateRentingOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('data') data: RentingOrderModel,
  ): Promise<RentingOrderModel> {
    const result = await this.rentingOrdersService.updateRentingOrder({
      id,
      creatorId: user.id,
      orgId: user.currentOrgId,
      data,
    });

    await this.orgActivityLogService.logUpdateRentingOrder({
      createdBy: user.id,
      orgId: user.currentOrgId,
      rentingOrderId: result.id,
      data: {
        rentingOrderId: result.id,
        orderCustomId: result.orderCustomId,
        updateActions: [],
      },
    });

    return result;
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async deleteRentingOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<RentingOrderModel> {
    const result = await this.rentingOrdersService.deleteRentingOrder({
      id,
      orgId: user.currentOrgId,
    });

    await this.orgActivityLogService.logDeleteRentingOrder({
      createdBy: user.id,
      orgId: user.currentOrgId,
      rentingOrderId: result.id,
      data: {
        rentingOrderId: result.id,
        orderCustomId: result.orderCustomId,
      },
    });

    return result;
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async changeRentingOrderStatus(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('data') data: RentingOrderUpdateStatusModel,
  ): Promise<RentingOrderModel> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'rentingOrderItems' },
      {
        fieldName: 'rentingDepositItems',
      },
      {
        fieldName: 'allowChangeToStatuses',
      },
      {
        fieldName: 'customerUser',
      },
      {
        fieldName: 'statusDetail',
      },
    ]);

    include['rentingDepositItem'] =
      graphQLFieldHandler.getIncludeForNestedRelationalFields([
        {
          fieldName: 'statusDetail',
          fieldPath: 'rentingDepositItems.RentingDepositItem',
        },
        {
          fieldName: 'typeDetail',
          fieldPath: 'rentingDepositItems.RentingDepositItem',
        },
      ]);

    include['rentingOrderItem'] =
      graphQLFieldHandler.getIncludeForNestedRelationalFields([
        {
          fieldName: 'statusDetail',
          fieldPath: 'rentingOrderItems.RentingOrderItem',
        },
      ]);

    const currentItem = await this.rentingOrdersService.getOrderDetail(
      id,
      user.currentOrgId,
      { statusDetail: true },
    );
    const result =
      await this.rentingOrdersStatusService.changeRentingOrderStatus({
        id,
        newStatus: data.newStatus,
        orgId: user.currentOrgId,
        include: {
          statusDetail: true,
        },
      });

    await this.orgActivityLogService.logChangeRentingOrderStatus({
      createdBy: user.id,
      orgId: user.currentOrgId,
      rentingOrderId: result.id,
      data: {
        rentingOrderId: result.id,
        orderCustomId: result.orderCustomId,
        fromStatus: {
          value: currentItem.statusDetail.value,
          color: currentItem.statusDetail.color,
          label: currentItem.statusDetail.label,
        },
        toStatus: {
          value: result.statusDetail.value,
          color: result.statusDetail.color,
          label: result.statusDetail.label,
        },
      },
    });

    return result;
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async getMyOrgRentingOrdersWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('paginationData')
    paginationData: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<RentingOrderModel>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'rentingOrderItems', fieldPath: 'items.RentingOrder' },
      {
        fieldName: 'rentingDepositItems',
        fieldPath: 'items.RentingOrder',
      },
      {
        fieldName: 'customerUser',
        fieldPath: 'items.RentingOrder',
      },
      {
        fieldName: 'statusDetail',
        fieldPath: 'items.RentingOrder',
      },
    ]);

    return this.rentingOrdersService.getRentingOrdersByOrgIdWithOffsetPaging(
      user.currentOrgId,
      paginationData.pageSize,
      paginationData.offset,
      paginationData.orderBy,
      include,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async getMyOrgRentingOrderDetail(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('id')
    id: string,
  ): Promise<RentingOrderModel> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'rentingOrderItems' },
      {
        fieldName: 'rentingDepositItems',
      },
      {
        fieldName: 'allowChangeToStatuses',
      },
      {
        fieldName: 'customerUser',
      },
      {
        fieldName: 'statusDetail',
      },
    ]);

    include['rentingDepositItem'] =
      graphQLFieldHandler.getIncludeForNestedRelationalFields([
        {
          fieldName: 'statusDetail',
          fieldPath: 'rentingDepositItems.RentingDepositItem',
        },
        {
          fieldName: 'typeDetail',
          fieldPath: 'rentingDepositItems.RentingDepositItem',
        },
      ]);

    include['rentingOrderItem'] =
      graphQLFieldHandler.getIncludeForNestedRelationalFields([
        {
          fieldName: 'statusDetail',
          fieldPath: 'rentingOrderItems.RentingOrderItem',
        },
      ]);

    return this.rentingOrdersService.getOrderDetail(
      id,
      user.currentOrgId,
      include,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_RENTING_ORDER)
  @UseGuards(GqlAuthGuard)
  async getRentingOrderItemsAfterDateByItemId(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('itemId')
    itemId: string,
    @Args('fromDate')
    fromDate: number,
  ): Promise<RentingOrderItemModel[]> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'statusDetail',
    ]);

    return this.rentingOrdersService.getRentingOrderItemsAfterDateByItemId(
      {
        itemId,
        orgId: user.currentOrgId,
        fromDate,
      },
      include,
    );
  }

  // Customer Only
  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  async customerAddItemToRentingOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: AddItemToOrderBagModel,
  ): Promise<{
    isSuccess: boolean;
    rentingOrderItemData: RentingOrderItemModel;
  }> {
    const result = this.customerRentingOrdersService.addItemToRentingOrder(
      user.id,
      data,
    );

    return result;
  }

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async customerGetMyRentingOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('paginationData')
    paginationData: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<RentingOrderModel>> {
    return this.customerRentingOrdersService.getListBagItems({
      userId: user.currentOrgId,
      offset: paginationData.offset,
      pageSize: paginationData.pageSize,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  async customerConvertBagToNewOrder(
    @CurrentUser() user: GuardUserPayload,
    @Args('rentingOrderId') rentingOrderId: String,
  ): Promise<RentingOrderModel> {
    const result = this.customerRentingOrdersService.convertBagToNew({
      userId: user.id,
      rentingOrderId,
    });

    return result;
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  async customerRemoveItemFromBag(
    @CurrentUser() user: GuardUserPayload,
    @Args('rentingOrderItemId') rentingOrderItemId: String,
  ): Promise<RentingOrderItemModel> {
    const result = this.customerRentingOrdersService.removeItemFromBag({
      userId: user.id,
      rentingOrderItemId,
    });

    return result;
  }
}
