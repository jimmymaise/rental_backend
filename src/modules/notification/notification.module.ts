import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { NotificationService } from './notification.service';
import { NotificationResolvers } from './notification.resolvers';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [],
  providers: [NotificationService, NotificationResolvers],
})
export class NotificationModule {}
