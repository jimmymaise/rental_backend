import { Controller, Get, Req } from '@nestjs/common';
import { ItemStatus } from '@prisma/client';
import { Request } from 'express';

import { AppService } from './app.service';
import { RedisCacheService } from '@modules/redis-cache/redis-cache.service';
import { PrismaService } from '@modules/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisCacheService: RedisCacheService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health-check')
  async healthCheck(): Promise<any> {
    const isRedisWorkig = await this.redisCacheService.ping();
    let isDatabaseWorking = false;
    try {
      await this.prismaService.$executeRaw(`select * from pg_stat_activity`);
      isDatabaseWorking = true;
    } catch {}

    return {
      cache: isRedisWorkig,
      database: isDatabaseWorking,
    };
  }

  @Get('sitemap-data')
  async siteMapData(@Req() request: Request): Promise<any> {
    const SITE_MAP_DATA_CACHE_KEY = 'SITE_MAP_DATA';
    const cachedSiteMapData = await this.redisCacheService.get(
      SITE_MAP_DATA_CACHE_KEY,
    );

    if (cachedSiteMapData) {
      return cachedSiteMapData;
    }

    const categories = await this.prismaService.category.findMany({
      take: 1000,
      where: {
        isDeleted: false,
      },
      select: {
        slug: true,
      },
    });

    // TODO: temporary to hard coded the number of items just in the MVP
    const items = await this.prismaService.item.findMany({
      take: 20000,
      orderBy: {
        createdDate: 'desc',
      },
      where: {
        status: ItemStatus.Published,
        isDeleted: false,
        isVerified: true,
      },
      select: {
        id: true,
        pid: true,
        slug: true,
        areas: {
          select: {
            slug: true,
          },
        },
        categories: {
          select: {
            slug: true,
          },
        },
      },
    });

    const siteMapData = {
      categories,
      items: items.map((item) => ({
        id: item.id,
        areas: item.areas.map((area) => ({ slug: area.slug })),
        categories: item.categories.map((category) => ({
          slug: category.slug,
        })),
        slug: item.slug,
        pid: item.pid,
      })),
    };

    const FIVE_DAYS = 432000;
    await this.redisCacheService.set(
      SITE_MAP_DATA_CACHE_KEY,
      siteMapData,
      FIVE_DAYS,
    );

    return siteMapData;
  }
}
