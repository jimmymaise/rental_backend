import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CustomerDto } from './customer.dto';

import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

import { OffsetPaginationDTO } from '@app/models';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}

  async getCustomersWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<CustomerDto>> {
    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'customer',
      include,
    );
    return pagingHandler.getPage(offset);
  }

  async getCustomersByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<CustomerDto>> {
    const whereQuery = {
      orgId: orgId,
    };

    return this.getCustomersWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }
}
