import { Module } from '@nestjs/common'

import { RentingItemRequetsService } from './renting-item-requests.service'
import { RentingItemRequestActivitiesService } from './renting-item-request-activities.service'
import { RentingItemRequestsResolvers } from './renting-item-requests.resolvers'
import { UsersModule } from '../users'

@Module({
  imports: [UsersModule],
  providers: [RentingItemRequestActivitiesService, RentingItemRequetsService, RentingItemRequestsResolvers]
})
export class RentingItemRequestsModule {}
