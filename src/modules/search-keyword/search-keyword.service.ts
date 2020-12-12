import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  SearchKeyword,
} from '@prisma/client';

@Injectable()
export class SearchKeywordService {
  constructor(
    private prismaService: PrismaService
  ) {}

  increaseKeywordCount(keyword: string): Promise<SearchKeyword> {
    const lowerKeyword = keyword.toLowerCase()
    return this.prismaService.searchKeyword.upsert({
      where: {
        keyword: lowerKeyword
      },
      create: {
        keyword: lowerKeyword,
        count: 1
      },
      update: {
        count: {
          increment: 1
        }
      }
    })
  }

  findTopKeywords(): Promise<SearchKeyword[]> {
    return this.prismaService.searchKeyword.findMany({ skip: 0, take: 45, orderBy: { count: 'desc' } })
  }
}
