import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

import { RedisCacheModule } from '@modules/redis-cache/redis-cache.module';

import { EmployeesService } from './employees.service';
import { StoragesModule } from '@modules/storages/storages.module';
import { EmployeesResolvers } from './employees.resolvers';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    StoragesModule,
    RedisCacheModule,
    UsersModule,
  ],
  providers: [EmployeesService, EmployeesResolvers],
})
export class EmployeesModule {}
