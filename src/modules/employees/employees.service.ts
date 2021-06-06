import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { EmployeeDto } from './employee.dto';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';

@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService) {
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

  async removeEmployeeByUserId(
    orgId,
    userId,
  ): Promise<any> {

    return this.prismaService.employee.delete({
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
    });
  }

  async removeEmployeeRoleByUserId(
    orgId,
    userId,
    roleIds,
    include,
  ): Promise<Employee> {

    return await this.prismaService.employee.update({
      include: include,
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
      data: {
        roles: {
          disconnect: roleIds.map((roleId) => {
            return { id: roleId };
          }),
        },
      },
    });
  }

  async addEmployeeRoleByUserId(
    orgId,
    userId,
    roleIds,
    include,
  ): Promise<Employee> {

    return await this.prismaService.employee.update({
      include: include,
      where: {
        userId_orgId: {
          userId: userId,
          orgId: orgId,
        },
      },
      data: {
        roles: {
          connect: roleIds.map((roleId) => {
            return { id: roleId };
          }),
        },
      },
    });
  }
}
