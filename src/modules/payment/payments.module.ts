import { Module } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { PaymentsResolvers } from './payments.resolvers';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { UsersModule } from '../users/users.module';
import { CustomAttributesModule } from '@modules/custom-attributes/custom-attributes.module';
import { OrgActivityLogModule } from '@app/modules/org-activity-log/org-activity-log.module';

@Module({
  imports: [
    RedisCacheModule,
    CustomAttributesModule,
    UsersModule,
    OrgActivityLogModule,
  ],
  providers: [PaymentsService, PaymentsResolvers],
})
export class PaymentsModule {}
