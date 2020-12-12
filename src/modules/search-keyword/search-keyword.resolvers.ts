import { Query, Resolver } from '@nestjs/graphql'

import { SearchKeywordService } from './search-keyword.service'
import {
  SearchKeyword,
} from '@prisma/client';

@Resolver('SearchKeyword')
export class SearchKeywordResolvers {
  constructor(private readonly searchKeywordService: SearchKeywordService) {}

  @Query()
  async getTopKeywords(): Promise<SearchKeyword[]> {
    return this.searchKeywordService.findTopKeywords()
  }
}

