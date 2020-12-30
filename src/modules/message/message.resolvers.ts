import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Mutation } from '@nestjs/graphql'

import { MessageService } from './message.service'
import {
  ChatSessionDTO
} from './chat-session.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { GuardUserPayload } from '../auth/auth.dto'

@Resolver('Message')
export class MessageResolvers {
  constructor(
    private messageService: MessageService
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async generateChatSessionWith(
    @CurrentUser() user: GuardUserPayload,
    @Args('chatWithUserId') chatWithUserId: string,
  ): Promise<ChatSessionDTO> {
    const members = [user.id, chatWithUserId]
    let existingSession = await this.messageService.findConversationUniqueByMembers(members)

    if (!existingSession) {
      existingSession = await this.messageService.createNewConversation(members)
    }

    return {
      id: existingSession.id
    }
  }

}

