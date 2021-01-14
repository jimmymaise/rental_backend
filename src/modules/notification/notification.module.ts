import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MessageModule } from '../message/message.module';
import { NotificationService } from './notification.service';
import { NotificationResolvers } from './notification.resolvers';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, MessageModule],
  controllers: [],
  providers: [NotificationService, NotificationResolvers],
  exports: [NotificationService],
})
export class NotificationModule {}
