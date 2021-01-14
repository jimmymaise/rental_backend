import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MessageService } from './message.service';
import { MessageResolvers } from './message.resolvers';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [],
  providers: [MessageGateway, MessageService, MessageResolvers],
  exports: [MessageGateway],
})
export class MessageModule {}
