import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@app/modules';
import { RedisCacheModule } from '@app/modules';

import { OrganizationsService } from './organizations.service';
import { StoragesModule } from '@app/modules';
import { OrganizationsResolvers } from './organizations.resolvers';
import { MailModule } from '@app/modules';

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
