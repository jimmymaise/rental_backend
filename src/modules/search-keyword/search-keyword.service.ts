import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SearchKeyword } from '@prisma/client';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class SearchKeywordService {
  constructor(
    private prismaService: PrismaService,
    private redisCacheService: RedisCacheService,
  ) {}

  increaseKeywordCount(keyword: string): Promise<SearchKeyword> {
    const lowerKeyword = keyword.toLowerCase();
    return this.prismaService.searchKeyword.upsert({
      where: {
        keyword: lowerKeyword,
      },
      create: {
        keyword: lowerKeyword,
        count: 1,
        isVerified: false,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });
  }

  async findTopKeywords(): Promise<SearchKeyword[]> {
    const TOP_KEYWORD_CACHE_KEY = 'TOP_KEYWORD';
    const cachedKeywords = await this.redisCacheService.get(
      TOP_KEYWORD_CACHE_KEY,
    );

    if (cachedKeywords) {
      return cachedKeywords as SearchKeyword[];
    }

    const keywords = await this.prismaService.searchKeyword.findMany({
      where: {
        isVerified: true,
      },
      skip: 0,
      take: 45,
      orderBy: { count: 'desc' },
    });

    await this.redisCacheService.set(TOP_KEYWORD_CACHE_KEY, keywords, 86400);

    return keywords as SearchKeyword[];
  }
}
