import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { EmployeeDto } from './employee.dto';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';
import { UsersService } from '@modules/users/users.service';
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';

@Injectable()
export class EmployeesService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private orgActivityLogService: OrgActivityLogService,
  ) {}

  async getEmployeesWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<EmployeeDto>> {
    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'employee',
      include,
    );
    return pagingHandler.getPage(offset);
  }

  async getEmployeesByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<EmployeeDto>> {
    const whereQuery = {
      orgId: orgId,
      isDeleted: false,
    };

    return this.getEmployeesWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  async addEmployeeByUserId({
    orgId,
    userId,
    roleIds,
    include,
    createdBy,
  }: {
    orgId: string;
    userId: string;
    roleIds: string[];
    include: any;
    createdBy: string;
  }): Promise<Employee> {
    const result = await this.prismaService.employee.create({
      include: {
        ...include,
        user: true,
      },
      data: {
        organization: { connect: { id: orgId } },
        user: { connect: { id: userId } },
        roles: {
          connect: roleIds.map((roleId) => {
            return { id: roleId };
          }),
        },
      },
    });

    await this.orgActivityLogService.logAddEmployee({
      createdBy,
      data: {
        employeeId: result.id,
        employeeName: result['user'].email,
      },
      employeeId: result.id,
      orgId,
    });

    return result;
  }

  async removeEmployeeByUserId({
    orgId,
    userId,
    updatedBy,
  }: {
    orgId: string;
    userId: string;
    updatedBy: string;
  }): Promise<any> {
    const result = await this.prismaService.employee.delete({
      include: {
        user: true,
      },
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
    });
    await this.usersService.resetUserDetailCache(userId);

    await this.orgActivityLogService.logRemoveEmployee({
      createdBy: updatedBy,
      data: {
        employeeId: result.id,
        employeeName: result['user'].email,
      },
      employeeId: result.id,
      orgId,
    });

    return result;
  }

  async updateEmployeeRoleByUserId({
    orgId,
    userId,
    roleIds,
    action,
    include,
    updatedBy,
  }: {
    orgId: string;
    userId: string;
    roleIds: string[];
    action: string;
    include: any;
    updatedBy: string;
  }): Promise<Employee> {
    let dbAction;

    switch (action) {
      case 'Set':
        dbAction = 'set';
        break;
      case 'Connect':
        dbAction = 'connect';
        break;
      case 'Disconnect':
        dbAction = 'disconnect';
        break;
    }

    const result = await this.prismaService.employee.update({
      include: include,
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
      data: {
        roles: {
          [dbAction]: roleIds.map((roleId) => {
            return { id: roleId };
          }),
        },
      },
    });
    await this.usersService.resetUserDetailCache(userId);

    await this.orgActivityLogService.logUpdateEmployee({
      createdBy: updatedBy,
      data: {
        employeeId: result.id,
        employeeName: result['user'].email,
        updateActions: [],
      },
      employeeId: result.id,
      orgId,
    });

    return result;
  }
}
