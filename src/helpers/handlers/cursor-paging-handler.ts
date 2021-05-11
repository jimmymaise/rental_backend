import { PrismaService } from '@modules/prisma/prisma.service';
import { OffsetPaginationDTO } from '@app/models';

class PageQueryDto {
  take: number;
  where: any;
  orderBy: any;
  skip?: number;
  include?: any;
}

export class CursorPagingHandler {
  where: any;
  pageSize: number;
  orderByColumn: string;
  orderByType: 'asc' | 'desc';
  initCursor: string | number;
  query: PageQueryDto;
  prismaService: PrismaService;
  table: string;
  include?: any;

  constructor(
    where: any,
    pageSize: number,
    orderByColumn = 'id',
    orderByType: 'asc' | 'desc',
    prismaService: PrismaService,
    table: string,
    initCursor?: any,
    include?: any,
  ) {
    this.where = where;
    this.pageSize = pageSize;
    this.orderByColumn = orderByColumn;
    this.orderByType = orderByType;
    this.initCursor = initCursor;
    this.prismaService = prismaService;
    this.table = table;
    this.query = {
      take: this.pageSize,
      where: where,
      orderBy: {
        [orderByColumn]: orderByType,
      },
      include: include,
    };
  }

  getPageQuery(cursor?: string | number): PageQueryDto {
    let cursorQuery = {};
    cursor = cursor || this.initCursor;
    if (![undefined, null].includes(cursor)) {
      cursorQuery = {
        skip: 1,
        cursor: {
          [this.orderByColumn]: cursor,
        },
      };
    }
    return {
      ...this.query,
      ...cursorQuery,
    };
  }

  async getPage(
    table,
    cursor?: string | number,
  ): Promise<OffsetPaginationDTO<any>> {
    const totalItem = await this.prismaService.user.count({
      where: this.where,
    });

    const pageQuery = this.getPageQuery(cursor);
    const pageResult = await this.prismaService[table].findMany({
      ...pageQuery,
    });
    const lastItemId =
      pageResult.length > 0 ? pageResult[pageResult.length - 1].id : null;
    return {
      items: pageResult,
      total: totalItem,
      offset: lastItemId,
      limit: this.pageSize,
    };
  }
}
