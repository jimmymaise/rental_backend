import { Module } from '@nestjs/common';

import { RedisCacheModule } from '../redis-cache/redis-cache.module';

import { SearchKeywordService } from './search-keyword.service';
import { SearchKeywordResolvers } from './search-keyword.resolvers';

@Module({
  imports: [RedisCacheModule],
  providers: [SearchKeywordService, SearchKeywordResolvers],
  exports: [SearchKeywordService],
})
export class SearchKeywordModule {}
