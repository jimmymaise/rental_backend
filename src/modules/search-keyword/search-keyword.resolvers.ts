import { Query, Resolver } from '@nestjs/graphql';

import { SearchKeywordService } from './search-keyword.service';
import { SearchKeyword } from '@prisma/client';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';

@Resolver('SearchKeyword')
export class SearchKeywordResolvers {
  constructor(private readonly searchKeywordService: SearchKeywordService) {}

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  async getTopKeywords(): Promise<SearchKeyword[]> {
    return this.searchKeywordService.findTopKeywords();
  }
}
