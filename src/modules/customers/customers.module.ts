import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';

import { RedisCacheModule } from '@modules/redis-cache/redis-cache.module';

import { CustomersService } from './customers.service';
import { StoragesModule } from '@modules/storages/storages.module';
import { CustomersResolvers } from './customers.resolvers';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    StoragesModule,
    RedisCacheModule,
  ],
  providers: [CustomersService, CustomersResolvers],
})
export class CustomersModule {}
