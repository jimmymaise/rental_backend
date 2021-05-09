import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@app/modules/auth/auth.module';

import { PermissionsService } from './permissions.service';
import { PermissionsResolvers } from './permissions.resolvers';

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [PermissionsService, PermissionsResolvers],
})
export class PermissionsModule {}
