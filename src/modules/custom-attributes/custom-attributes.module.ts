import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';

import { CustomAttributesService } from './custom-attributes.service';
import { CustomAttributesResolvers } from './custom-attributes.resolvers';

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [CustomAttributesService, CustomAttributesResolvers],
  exports: [CustomAttributesService],
})
export class CustomAttributesModule {}
