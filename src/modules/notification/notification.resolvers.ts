import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';

import { NotificationService } from './notification.service';
import { NotificationDTO } from './notification.dto';
import { PaginationDTO } from '../../models';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GuardUserPayload } from '../auth/auth.dto';

@Resolver('Notification')
export class NotificationResolvers {
  constructor(private notificationService: NotificationService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyNotifications(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      offset: number;
      limit: number;
    },
  ): Promise<PaginationDTO<NotificationDTO>> {
    const { offset, limit } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;

    const result = await this.notificationService.findAllMyNotifications({
      offset,
      limit,
      userId: user.id,
    });

    return {
      items: result.items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }
}
