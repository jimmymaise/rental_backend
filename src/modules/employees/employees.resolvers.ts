import { UseGuards } from '@nestjs/common';
import { QueryWithOffsetPagingDTO } from '@app/models';
import { Employee } from '@prisma/client';

import { Args, Resolver, Query, Info, Mutation } from '@nestjs/graphql';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';

import { EmployeesService } from './employees.service';
import { GuardUserPayload } from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { EmployeeDto } from './employee.dto';
import { OffsetPaginationDTO } from '../../models';
import { Permission } from '@modules/auth/permission/permission.enum';
// Internal for only UI UserPermission
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GraphQLResolveInfo } from 'graphql';
import {
  AddEmployeeByUserIdDTO,
  UpdateEmployeeRolesByUserIdDTO,
} from '@modules/employees/employee.dto';

@Resolver('Employee')
export class EmployeesResolvers {
  constructor(private readonly employeeService: EmployeesService) {}

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async getMyOrgEmployeesWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('getMyOrgEmployeesWithOffsetPagingData')
    getMyOrgEmployeesWithOffsetPagingData: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<EmployeeDto>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'user', fieldPath: 'items.EmployeeInfo' },
      { fieldName: 'roles', fieldPath: 'items.EmployeeInfo' },
    ]);
    const userInfoInclude = graphQLFieldHandler.getIncludeForNestedRelationalFields(
      [
        {
          fieldName: 'userInfo',
          fieldPath: 'items.EmployeeInfo.user.DBUserInfoForEmployee',
        },
      ],
    );
    if (userInfoInclude['userInfo']) {
      include['user'] = {
        include: userInfoInclude,
      };
    }

    return this.employeeService.getEmployeesByOrgIdWithOffsetPaging(
      user.currentOrgId,
      getMyOrgEmployeesWithOffsetPagingData.pageSize,
      getMyOrgEmployeesWithOffsetPagingData.offset,
      getMyOrgEmployeesWithOffsetPagingData.orderBy,
      include,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async addEmployeeToOrganization(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('addEmployeeByUserIdData')
    addEmployeeByUserIdData: AddEmployeeByUserIdDTO,
  ): Promise<Employee> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'roles',
    ]);
    return this.employeeService.addEmployeeByUserId({
      orgId: user.currentOrgId,
      userId: addEmployeeByUserIdData.userId,
      roleIds: addEmployeeByUserIdData.roleIds,
      include,
      createdBy: user.id,
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async removeEmployeeFromOrganization(
    @CurrentUser() user: GuardUserPayload,
    @Args('id')
    id: string,
  ): Promise<{ id: string }> {
    await this.employeeService.removeEmployeeByUserId({
      orgId: user.currentOrgId,
      userId: id,
      updatedBy: user.id,
    });
    return { id: user.currentOrgId };
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async updateEmployeeRoles(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('updateEmployeeRolesByUserIdData')
    updateEmployeeRolesByUserIdData: UpdateEmployeeRolesByUserIdDTO,
  ): Promise<Employee> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'roles',
    ]);
    return this.employeeService.updateEmployeeRoleByUserId({
      orgId: user.currentOrgId,
      userId: updateEmployeeRolesByUserIdData.userId,
      roleIds: updateEmployeeRolesByUserIdData.roleIds,
      action: updateEmployeeRolesByUserIdData.action,
      include,
      updatedBy: user.id,
    });
  }
}
