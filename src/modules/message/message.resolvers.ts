import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';

import { MessageService } from './message.service';
import { ChatConversationDTO } from './chat-conversation.dto';
import { OffsetPaginationDTO } from '../../models';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GuardUserPayload } from '../auth/auth.dto';
import { UsersService } from '../users/users.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { OrganizationsService } from '../organizations/organizations.service';

@Resolver('Message')
export class MessageResolvers {
  constructor(
    private messageService: MessageService,
    private userService: UsersService,
    private organizationService: OrganizationsService,
  ) {}

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async generateChatConversationWith(
    @CurrentUser() user: GuardUserPayload,
    @Args('chatWithUserId') chatWithUserId: string,
  ): Promise<ChatConversationDTO> {
    const members = [user.id, chatWithUserId];
    let existingSession = await this.messageService.findConversationUniqueByMembers(
      members,
    );

    if (!existingSession) {
      existingSession = await this.messageService.createNewConversation(
        members,
        user.id,
      );
    }

    const memberDetails = [];
    for (let i = 0; i < members.length; i++) {
      const userInfo = await this.userService.getUserDetailData(members[i]);
      memberDetails.push({
        id: userInfo.id,
        displayName: userInfo.displayName,
        avatarImage: userInfo.avatarImage,
        coverImage: userInfo.coverImage,
      });
    }

    return {
      id: existingSession.id,
      members: memberDetails,
    };
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async generateChatConversationWithOrg(
    @CurrentUser() user: GuardUserPayload,
    @Args('chatWithOrgId') chatWithOrgId: string,
  ): Promise<ChatConversationDTO> {
    const orgDetail = await this.organizationService.getOrganization(
      chatWithOrgId,
      null,
    );

    if (!orgDetail) {
      throw new Error('Org not existed');
    }

    let existingSession = await this.messageService.findConversationBetweenUserAndOrg(
      user.id,
      chatWithOrgId,
      orgDetail.createdBy,
    );

    if (!existingSession) {
      existingSession = await this.messageService.createNewConversationBetweenUserAndOrg(
        user.id,
        {
          orgId: chatWithOrgId,
          userId: orgDetail.createdBy, // Default get the CreatedByOrg, because in the first time user chat with Org, We don't know
        },
        user.id,
      );
    }

    const memberDetails = [];
    const members = (existingSession as any).chatConversationMembers;
    for (let i = 0; i < members.length; i++) {
      const userInfo = await this.userService.getUserDetailData(
        members[i].userId,
      );
      const currentOrgDetail = members[i].orgId
        ? await this.organizationService.getOrgSummaryCache(members[i].orgId)
        : null;

      memberDetails.push({
        id: userInfo.id,
        displayName: userInfo.displayName,
        avatarImage: userInfo.avatarImage,
        coverImage: userInfo.coverImage,
        currentOrgDetail,
      });
    }

    return {
      id: existingSession.id,
      members: memberDetails,
    };
  }

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async feedMyConversations(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      offset: number;
      limit: number;
    },
  ): Promise<OffsetPaginationDTO<ChatConversationDTO>> {
    const { offset, limit } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;

    const result = await this.messageService.findAllMyConversations({
      offset,
      limit,
      userId: user.id,
    });
    const items = [];

    for (let i = 0; i < result.items.length; i++) {
      const currentItem: any = result.items[i];

      const onlyVisibleWhenFromUserOrHaveMessageToAvoidSpamConversation =
        currentItem.createdBy === user.id || currentItem.chatMessages.length;
      const newItem = {
        id: currentItem.id,
        lastMessages: [],
        members: [],
        isVisible: onlyVisibleWhenFromUserOrHaveMessageToAvoidSpamConversation,
      };

      const lastMessages = [];
      for (let j = 0; j < currentItem.chatMessages.length; j++) {
        const message = currentItem.chatMessages[j];
        const fromUserDetailData = await this.userService.getUserDetailData(
          message.fromUserId,
        );
        const fromOrgDetail = message.fromOrgId
          ? await this.organizationService.getOrgSummaryCache(message.fromOrgId)
          : null;
        lastMessages.push({
          id: message.id,
          content: message.content,
          replyToId: message.replyToId,
          chatConversationId: message.chatConversationId,
          fromUserId: message.fromUserId,
          fromUserInfo: {
            ...fromUserDetailData,
            currentOrgDetail: fromOrgDetail,
          },
          isRead: message.isRead,
          createdDate: message.createdDate.getTime(),
        });
      }
      newItem.lastMessages = lastMessages;

      const memberDetails = [];
      const conversationMembers = currentItem['chatConversationMembers'];
      for (let i = 0; i < conversationMembers.length; i++) {
        const userInfo = await this.userService.getUserDetailData(
          conversationMembers[i].userId,
        );
        const orgDetail = conversationMembers[i].orgId
          ? await this.organizationService.getOrgSummaryCache(
              conversationMembers[i].orgId,
            )
          : null;
        memberDetails.push({
          id: userInfo.id,
          displayName: userInfo.displayName,
          avatarImage: userInfo.avatarImage,
          coverImage: userInfo.coverImage,
          currentOrgDetail: orgDetail,
        });
      }

      newItem.members = memberDetails;

      items.push(newItem);
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }

  // @Query()
  // @UseGuards(GqlAuthGuard)
  // async feedChatMessageInfo(
  //   @CurrentUser() user: GuardUserPayload,
  // ): Promise<MessageInfoModel> {
  //   const unReadCount = await this.messageService.countUnReadConversation(
  //     user.id,
  //   );

  //   return {
  //     unReadCount,
  //   };
  // }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async markMessageAsRead(
    @Args('messageId') messageId: string,
  ): Promise<boolean> {
    await this.messageService.markMessageAsRead(messageId);

    return true;
  }
}
