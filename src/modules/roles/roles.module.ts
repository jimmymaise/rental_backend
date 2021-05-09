import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@app/modules/auth/auth.module';
import { RedisCacheModule } from '@app/modules/redis-cache/redis-cache.module';

import { RolesService } from './roles.service';
import { StoragesModule } from '@app/modules/storages/storages.module';
import { RolesResolvers } from './roles.resolvers';
import { MailModule } from '@app/modules/mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    MailModule,
    StoragesModule,
    RedisCacheModule,
  ],
  providers: [RolesService, RolesResolvers],
  exports: [RolesService],
})
export class RolesModule {}
