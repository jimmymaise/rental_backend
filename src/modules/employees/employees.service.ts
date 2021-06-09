import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { EmployeeDto } from './employee.dto';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';
import { UsersService } from '@modules/users/users.service';


@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService,
              private usersService: UsersService,
  ) {
  }

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
    };

    return this.getEmployeesWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  async addEmployeeByUserId(
    orgId,
    userId,
    roleIds,
    include,
  ): Promise<Employee> {
    return this.prismaService.employee.create({
      include: include,
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
  }

  async removeEmployeeByUserId(orgId, userId): Promise<any> {
    await this.prismaService.employee.delete({
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
    });
    await this.usersService.resetUserDetailCache(userId);
  }

  async updateEmployeeRoleByUserId(
    orgId,
    userId,
    roleIds,
    action,
    include,
  ): Promise<Employee> {
    let result = await this.prismaService.employee.update({
      include: include,
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
      data: {
        roles: {
          [action]: roleIds.map((roleId) => {
            return { id: roleId };
          }),
        },
      },
    });
    await this.usersService.resetUserDetailCache(userId);
    return result;
  }
}
