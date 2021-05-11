import { UseGuards, BadRequestException } from '@nestjs/common';
import { QueryWithOffsetPagingDTO } from '@app/models';

import {
  Args,
  Resolver,
  Mutation,
  Query,
  Context,
  Info,
} from '@nestjs/graphql';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';

import { EmployeesService } from './employees.service';
import { AdminUsersService } from './admin-users.service';
import { GuardUserPayload, AuthDTO } from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { GqlRefreshGuard } from '../auth/gpl-request.guard';
import { EveryoneGqlAuthGuard } from '../auth/everyone-gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  EmployeeDto,
} from './employee.dto';
import { OffsetPaginationDTO } from '../../models';
import { Permission } from '@modules/auth/permission/permission.enum';
// Internal for only UI UserPermission
import { Permission as UserPermission } from './permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { AuthService } from '@modules/auth/auth.service';
import { GqlPermissionsGuard } from '@modules/auth/permission/gql-permissions.guard';
import { ErrorMap } from '@app/constants';
import { EmailService } from '@modules/mail/mail.service';
import { GraphQLResolveInfo } from 'graphql';

@Resolver('User')
export class EmployeesResolvers {
  constructor(
    private readonly employeeService: EmployeesService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly adminemployeeService: AdminUsersService,
  ) {
  }


  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async getMyOrgEmployeesWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('getMyOrgEmployeesWithOffsetPagingData')
      getMyOrgUsersWithOffsetPagingData: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<EmployeeDto>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'userInfo', fieldPath: 'items.EmployeeInfo' },
    ]);

    return this.employeeService.getEmployeesByOrgIdWithOffsetPaging(
      user.currentOrgId,
      getMyOrgUsersWithOffsetPagingData.pageSize,
      getMyOrgUsersWithOffsetPagingData.offset,
      getMyOrgUsersWithOffsetPagingData.orderBy,
      include,
    );
  }


}
