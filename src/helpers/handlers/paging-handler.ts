import { PrismaService } from '@modules/prisma/prisma.service';
import { PaginationDTO } from '@app/models';

class PageQueryDto {
  take: number;
  where: object;
  orderBy: object;
  skip?: number;

}

export class PagingHandler {
  where: object;
  pageSize: number;
  orderByColumn: string;
  orderByType: 'asc' | 'desc';
  initCursor: string | number;
  query: PageQueryDto;
  prismaService: PrismaService;
  table: string;


  constructor(
    where: object,
    pageSize: number,
    orderByColumn: string = 'id',
    orderByType: 'asc' | 'desc',
    prismaService: PrismaService,
    table: string,
    initCursor?: any,
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

  async getPage(table, cursor?: string | number): Promise<PaginationDTO<any>> {

    let totalItem = await this.prismaService.user.count({
      where: this.where,
    });

    let pageQuery = this.getPageQuery(cursor);
    let pageResult = await this.prismaService[table].findMany({
      ...pageQuery,
    });
    let lastItemId = pageResult.length > 0 ? pageResult[pageResult.length - 1].id : null;
    return {
      items: pageResult,
      total: totalItem,
      offset: lastItemId,
      limit: this.pageSize,
    };

  }

}
