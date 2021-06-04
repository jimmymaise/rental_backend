import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { QueryWithOffsetPagingDTO } from '@app/models';
import { SellingOrdersService } from './selling-orders.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { SellingOrderCreateModel } from './models/selling-order-create.model';
import { SellingOrderModel } from './models/selling-order.model';
import { OffsetPaginationDTO } from '../../models';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';

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

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_SELLING_ORDER)
  @UseGuards(GqlAuthGuard)
  async getMyOrgSellingOrdersWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('paginationData')
    paginationData: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<SellingOrderModel>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'rentingOrderItems', fieldPath: 'items.SellingOrder' },
      {
        fieldName: 'rentingDepositItems',
        fieldPath: 'items.SellingOrder',
      },
      {
        fieldName: 'customerUser',
        fieldPath: 'items.SellingOrder',
      },
      {
        fieldName: 'statusDetail',
        fieldPath: 'items.SellingOrder',
      },
    ]);

    return this.sellingOrdersService.getSellingOrdersByOrgIdWithOffsetPaging(
      user.currentOrgId,
      paginationData.pageSize,
      paginationData.offset,
      paginationData.orderBy,
      include,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_SELLING_ORDER)
  @UseGuards(GqlAuthGuard)
  async getMyOrgSellingOrderDetail(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('id')
    id: string,
  ): Promise<SellingOrderModel> {
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

    include[
      'rentingDepositItem'
    ] = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      {
        fieldName: 'statusDetail',
        fieldPath: 'rentingDepositItems.RentingDepositItem',
      },
      {
        fieldName: 'typeDetail',
        fieldPath: 'rentingDepositItems.RentingDepositItem',
      },
    ]);

    include[
      'rentingOrderItem'
    ] = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      {
        fieldName: 'statusDetail',
        fieldPath: 'rentingOrderItems.RentingOrderItem',
      },
    ]);

    return this.sellingOrdersService.getOrderDetail(
      id,
      user.currentOrgId,
      include,
    );
  }
}
