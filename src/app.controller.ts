import { Controller, Get } from '@nestjs/common';
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
}
