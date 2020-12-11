import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'
import { MyUserContactsService } from './my-user-contacts.service'
import { WishingItemsResolvers } from './my-user-contacts.resolvers'

@Module({
  imports: [UsersModule],
  providers: [MyUserContactsService, WishingItemsResolvers],
})
export class MyUserContactsModule {}
