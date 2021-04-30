import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@app/modules/auth/auth.module';
import { RedisCacheModule } from '@app/modules/redis-cache/redis-cache.module';

import { OrganizationsService } from './organizations.service';
import { StoragesModule } from '@app/modules/storages/storages.module';
import { OrganizationsResolvers } from './organizations.resolvers';
import { MailModule } from '@app/modules/mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    MailModule,
    StoragesModule,
    RedisCacheModule,
  ],
  providers: [OrganizationsService, OrganizationsResolvers],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
