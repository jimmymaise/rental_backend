import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';

import { MessageService, MessageInfoModel } from './message.service';
import { ChatConversationDTO } from './chat-conversation.dto';
import { PaginationDTO } from '../../models';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GuardUserPayload } from '../auth/auth.dto';
import { UsersService } from '../users/users.service';

@Resolver('Message')
export class MessageResolvers {
  constructor(
    private messageService: MessageService,
    private userService: UsersService,
  ) {}

  @Mutation()
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

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyConversations(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      offset: number;
      limit: number;
    },
  ): Promise<PaginationDTO<ChatConversationDTO>> {
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
        lastMessages.push({
          id: message.id,
          content: message.content,
          replyToId: message.replyToId,
          chatConversationId: message.chatConversationId,
          fromUserId: message.fromUserId,
          fromUserInfo: await this.userService.getUserDetailData(
            message.fromUserId,
          ),
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
        memberDetails.push({
          id: userInfo.id,
          displayName: userInfo.displayName,
          avatarImage: userInfo.avatarImage,
          coverImage: userInfo.coverImage,
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
  @UseGuards(GqlAuthGuard)
  async markMessageAsRead(
    @Args('messageId') messageId: string,
  ): Promise<boolean> {
    await this.messageService.markMessageAsRead(messageId);

    return true;
  }
}
