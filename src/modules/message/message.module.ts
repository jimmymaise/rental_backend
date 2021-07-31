import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MessageService } from './message.service';
import { MessageResolvers } from './message.resolvers';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, OrganizationsModule],
  controllers: [],
  providers: [MessageGateway, MessageService, MessageResolvers],
  exports: [MessageGateway],
})
export class MessageModule {}
