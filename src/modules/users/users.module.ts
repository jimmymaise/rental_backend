import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { StoragesModule } from '../storages/storages.module'
import { UsersResolvers } from './users.resolvers'

@Module({
  imports: [StoragesModule],
  providers: [UsersService, UsersResolvers],
  exports: [UsersService]
})
export class UsersModule {}
