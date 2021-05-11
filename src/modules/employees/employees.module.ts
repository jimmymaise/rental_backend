import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '@modules/organizations/organizations.module';

import { RedisCacheModule } from '../redis-cache/redis-cache.module';

import { EmployeesService } from './employees.service';
import { AdminUsersService } from './admin-users.service';
import { StoragesModule } from '../storages/storages.module';
import { EmployeesResolvers } from './employees.resolvers';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    MailModule,
    StoragesModule,
    RedisCacheModule,
    OrganizationsModule,
  ],
  providers: [EmployeesService, AdminUsersService, EmployeesResolvers],
  exports: [EmployeesService],
})
export class EmployeesModule {}
