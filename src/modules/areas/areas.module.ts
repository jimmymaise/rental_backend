import { Module } from '@nestjs/common';

import { AreasService } from './areas.service';
import { AreasResolvers } from './areas.resolvers';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [AreasService, AreasResolvers],
})
export class AreasModule {}
