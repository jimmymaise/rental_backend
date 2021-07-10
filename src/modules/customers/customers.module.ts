import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';

import { RedisCacheModule } from '@modules/redis-cache/redis-cache.module';

import { CustomersService } from './customers.service';
import { StoragesModule } from '@modules/storages/storages.module';
import { CustomersResolvers } from './customers.resolvers';
import { UsersModule } from '@modules/users/users.module';
import { OrgActivityLogModule } from '@modules/org-activity-log/org-activity-log.module';
import { OrgStatisticsModule } from '@modules/org-statistics/org-statistics.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    StoragesModule,
    RedisCacheModule,
    OrgActivityLogModule,
    OrgStatisticsModule,
  ],
  providers: [CustomersService, CustomersResolvers],
})
export class CustomersModule {}
