import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { MyContactBooksService } from './my-contact-book.service';
import { WishingItemsResolvers } from './my-contact-book.resolvers';

@Module({
  imports: [UsersModule, OrganizationsModule],
  providers: [MyContactBooksService, WishingItemsResolvers],
})
export class MyContactBooksModule {}
