import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@app/modules/auth/auth.module';
import { RedisCacheModule } from '@app/modules/redis-cache/redis-cache.module';
import { StoragesModule } from '@app/modules/storages/storages.module';
import { MailModule } from '@app/modules/mail/mail.module';

import { OrganizationsService } from './organizations.service';
import { OrganizationsResolvers } from './organizations.resolvers';

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
