import { PrismaService } from '@modules/prisma/prisma.service';
import { OffsetPaginationDTO } from '@app/models';

class OffsetPageQueryDto {
  take: number;
  where: object;
  orderBy: object;
  skip?: number;
  include?: object;
}

export class OffsetPagingHandler {
  where: object;
  pageSize: number;
  orderBy: object;
  query: OffsetPageQueryDto;
  prismaService: PrismaService;
  table: string;
  include?: object;

  constructor(
    where: object,
    pageSize: number,
    orderBy: object,
    prismaService: PrismaService,
    table: string,
    include?: object,
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

  getPageQuery(offset: number = 0): OffsetPageQueryDto {
    return {
      skip: offset,
      ...this.query,
    };
  }

  async getPage(table, offset: number = 0): Promise<OffsetPaginationDTO<any>> {
    let totalItem = await this.prismaService.user.count({
      where: this.where,
    });

    let pageQuery = this.getPageQuery(offset);
    let pageResult = await this.prismaService[table].findMany({
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
