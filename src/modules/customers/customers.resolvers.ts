import { UseGuards } from '@nestjs/common';
import { QueryWithOffsetPagingDTO } from '@app/models';

import { Args, Resolver, Query, Info, Mutation } from '@nestjs/graphql';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';

import { CustomersService } from './customers.service';
import { GuardUserPayload } from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CustomerDto } from './customer.dto';
import { OffsetPaginationDTO } from '../../models';
import { Permission } from '@modules/auth/permission/permission.enum';
// Internal for only UI UserPermission
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { CustomerModel, CustomerCreateModel } from './models';

@Resolver('Customer')
export class CustomersResolvers {
  constructor(private readonly customerService: CustomersService) {}

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOMER)
  @UseGuards(GqlAuthGuard)
  async getMyOrgCustomersWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('data')
    data: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<CustomerDto>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'user', fieldPath: 'items.CustomerInfo' },
    ]);
    const userInfoInclude = graphQLFieldHandler.getIncludeForNestedRelationalFields(
      [
        {
          fieldName: 'userInfo',
          fieldPath: 'items.CustomerInfo.user.DBUserInfoForCustomer',
        },
      ],
    );
    if (userInfoInclude['userInfo']) {
      include['user'] = {
        include: userInfoInclude,
      };
    }

    return this.customerService.getCustomersByOrgIdWithOffsetPaging(
      user.currentOrgId,
      data.pageSize,
      data.offset,
      data.orderBy,
      include,
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_CUSTOMER)
  @UseGuards(GqlAuthGuard)
  async createCustomer(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: CustomerCreateModel,
  ): Promise<CustomerModel> {
    return this.customerService.createCustomer({
      orgId: user.currentOrgId,
      data,
    });
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_CUSTOMER)
  @UseGuards(GqlAuthGuard)
  async updateCustomer(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('data') data: CustomerCreateModel,
  ): Promise<CustomerModel> {
    return this.customerService.updateCustomer({
      id,
      orgId: user.currentOrgId,
      data,
    });
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOMER)
  @UseGuards(GqlAuthGuard)
  async getCustomerDetail(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<CustomerModel> {
    return this.customerService.getCustomerDetail({
      id,
      orgId: user.currentOrgId,
    });
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOMER)
  @UseGuards(GqlAuthGuard)
  async getOrCreateCustomerByUserId(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<CustomerModel> {
    return this.customerService.getOrCreateCustomerByUserId({
      userId,
      orgId: user.currentOrgId,
    });
  }
}
