import { PrismaService } from '@modules/prisma/prisma.service';
import { OffsetPaginationDTO } from '@app/models';

class OffsetPageQueryDto {
  take: number;
  where: any;
  orderBy: any;
  skip?: number;
  include?: any;
}

export class OffsetPagingHandler {
  where: any;
  pageSize: number;
  orderBy: any;
  query: OffsetPageQueryDto;
  prismaService: PrismaService;
  table: string;
  include?: any;

  constructor(
    where: any,
    pageSize: number,
    orderBy: any,
    prismaService: PrismaService,
    table: string,
    include?: any,
  ) {
    this.where = where;
    this.pageSize = pageSize;
    this.orderBy = orderBy;
    this.prismaService = prismaService;
    this.table = table;
    this.query = {
      take: this.pageSize,
      where: where,
      orderBy: orderBy,
      include: include,
    };
  }

  getPageQuery(offset = 0): OffsetPageQueryDto {
    return {
      skip: offset,
      ...this.query,
    };
  }

  async getPage(offset = 0): Promise<OffsetPaginationDTO<any>> {
    const totalItem = await this.prismaService[this.table].count({
      where: this.where,
    });

    const pageQuery = this.getPageQuery(offset);
    const pageResult = await this.prismaService[this.table].findMany({
      ...pageQuery,
    });
    return {
      items: pageResult,
      total: totalItem,
      offset:
        offset + this.pageSize <= totalItem ? offset + this.pageSize : null,
      limit: this.pageSize,
    };
  }
}
