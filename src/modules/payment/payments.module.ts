import { Module } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { PaymentsResolvers } from './payments.resolvers';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [PaymentsService, PaymentsResolvers],
})
export class PaymentsModule {}
