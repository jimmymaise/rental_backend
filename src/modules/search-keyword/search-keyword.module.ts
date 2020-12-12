import { Module } from '@nestjs/common';

import { SearchKeywordService } from './search-keyword.service';
import { SearchKeywordResolvers } from './search-keyword.resolvers';

@Module({
  providers: [SearchKeywordService, SearchKeywordResolvers],
  exports: [SearchKeywordService]
})
export class SearchKeywordModule {}
