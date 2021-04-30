import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '@modules/organizations/organizations.module';

import { RedisCacheModule } from '../redis-cache/redis-cache.module';

import { UsersService } from './users.service';
import { AdminUsersService } from './admin-users.service';
import { StoragesModule } from '../storages/storages.module';
import { UsersResolvers } from './users.resolvers';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    MailModule,
    StoragesModule,
    RedisCacheModule,
    OrganizationsModule,
  ],
  providers: [UsersService, AdminUsersService, UsersResolvers],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
