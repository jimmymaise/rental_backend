import { Injectable } from '@nestjs/common';


import { PrismaService } from '../prisma/prisma.service';
import {
  EmployeeDto,
} from './employee.dto';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';


@Injectable()
export class EmployeesService {
  constructor(
    private prismaService: PrismaService,
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


}
