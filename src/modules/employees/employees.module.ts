import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';
import { OrganizationsModule } from '@modules/organizations/organizations.module';

import { RedisCacheModule } from '@modules/redis-cache/redis-cache.module';

import { EmployeesService } from './employees.service';
import { StoragesModule } from '@modules/storages/storages.module';
import { EmployeesResolvers } from './employees.resolvers';
import { MailModule } from '@modules/mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    MailModule,
    StoragesModule,
    RedisCacheModule,
    OrganizationsModule,
  ],
  providers: [EmployeesService, EmployeesResolvers],
  exports: [EmployeesService],
})
export class EmployeesModule {
}
