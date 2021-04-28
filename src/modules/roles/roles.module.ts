import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@app/modules';
import { RedisCacheModule } from '@app/modules';

import { RolesService } from './roles.service';
import { StoragesModule } from '@app/modules';
import { RolesResolvers } from './roles.resolvers';
import { MailModule } from '@app/modules';

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
