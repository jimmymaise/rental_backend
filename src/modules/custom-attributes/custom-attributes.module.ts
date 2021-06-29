import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';

import { CustomAttributesService } from './custom-attributes.service';
import { CustomAttributesResolvers } from './custom-attributes.resolvers';
import { OrgActivityLogModule } from '@modules/org-activity-log/org-activity-log.module';

@Module({
  imports: [AuthModule, ConfigModule, OrgActivityLogModule],
  providers: [CustomAttributesService, CustomAttributesResolvers],
  exports: [CustomAttributesService],
})
export class CustomAttributesModule {}
