import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

import { RedisCacheModule } from '@modules/redis-cache/redis-cache.module';

import { EmployeesService } from './employees.service';
import { StoragesModule } from '@modules/storages/storages.module';
import { EmployeesResolvers } from './employees.resolvers';
import { OrgActivityLogModule } from '@modules/org-activity-log/org-activity-log.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    StoragesModule,
    RedisCacheModule,
    UsersModule,
    OrgActivityLogModule,
  ],
  providers: [EmployeesService, EmployeesResolvers],
})
export class EmployeesModule {}
