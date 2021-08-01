import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import sanitizeHtml from 'sanitize-html';

import { WebsocketAuthGuard } from '../auth/ws-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { MessageService } from './message.service';
import { OrganizationsService } from '../organizations/organizations.service';

// import { GatewayMetadata } from '@nestjs/websockets';
// export interface GatewayMetadataExtended extends GatewayMetadata {
//   handlePreflightRequest: (req, res) => void;
// }

// Custom CORS Origin
// const options = {
//   namespace: '/messenger',
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       'Access-Control-Allow-Headers': 'Content-Type, authorization, x-token',
//       'Access-Control-Allow-Origin': req.headers.origin,
//       'Access-Control-Allow-Credentials': true,
//       'Access-Control-Max-Age': '1728000',
//       'Content-Length': '0',
//     };
//     res.writeHead(200, headers);
//     res.end();
//   },
// } as GatewayMetadataExtended;

function getUserRoom(userId: string) {
  return `messenger-room-${userId}`;
}

@WebSocketGateway({ namespace: '/messenger' })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private messageService: MessageService,
    private organizationSevice: OrganizationsService,
  ) {}

  // @SubscribeMessage('msgToServer')
  // public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
  //   return (this.server as any).to(payload.room).emit('msgToClient', payload);
  // }

  @UseGuards(WebsocketAuthGuard)
  @SubscribeMessage('joinConversation')
  public async joinConversation(
    client: Socket,
    { conversationId, user, isGetListMember, isGetAllMesseages },
  ): Promise<void> {
    const members = await this.messageService.getConversationMembers(
      conversationId,
    );
    if (!members || !members.length) {
      throw new WsException({ errorMessage: 'Conversation is not valid' });
    }

    if (!members.find((member) => member.userId === user.userId)) {
      throw new WsException({
        errorMessage: "You're not allow to join this conversation",
      });
    }

    const memberDetails = [];
    if (isGetListMember) {
      for (let i = 0; i < members.length; i++) {
        const userInfo = await this.userService.getUserDetailData(
          members[i].userId,
        );
        const currentOrgDetail = members[i].orgId
          ? await this.organizationSevice.getOrgSummaryCache(members[i].orgId)
          : null;
        memberDetails.push({
          id: userInfo.id,
          displayName: userInfo.displayName,
          avatarImage: userInfo.avatarImage,
          coverImage: userInfo.coverImage,
          currentOrgDetail,
        });
      }
    }

    let messages = [];
    if (isGetAllMesseages) {
      messages = await this.messageService.findAllMyMessagesInConversation({
        conversationId,
      });
    }

    client.join(conversationId);
    client.emit('joinedConversation', {
      conversationId,
      members: memberDetails,
      messages,
    });
  }

  @UseGuards(WebsocketAuthGuard)
  @SubscribeMessage('leftConversation')
  public leftConversation(client: Socket, { conversationId }): void {
    client.leave(conversationId);
    client.emit('leftConversation', { conversationId });
  }

  @UseGuards(WebsocketAuthGuard)
  @SubscribeMessage('sendMessageToConversation')
  public async sendMessageToConversation(
    client: Socket,
    { conversationId, content, user, replyToId, members },
  ): Promise<void> {
    if (!client.rooms.has(conversationId)) {
      throw new WsException({
        errorMessage: "You're not allow to send message this conversation",
      });
    }

    const secureContent = sanitizeHtml(content);

    const newMessage = await this.messageService.addMessage({
      fromUserId: user.userId,
      fromOrgId: user.orgId,
      content: secureContent,
      chatConversationId: conversationId,
      replyToId,
    });

    const userInfo = await this.userService.getUserDetailData(user.userId);
    const fromOrgDetail = user.orgId
      ? await this.organizationSevice.getOrgSummaryCache(user.orgId)
      : null;
    const newMessageToClient = {
      chatConversationId: conversationId,
      id: newMessage.id,
      content: secureContent,
      replyToId,
      fromUserId: user.userId,
      fromUserInfo: userInfo,
      fromOrgDetail,
      createdDate: newMessage.createdDate.getTime(),
    };

    members.forEach((member) => {
      (this.server as any)
        .to(getUserRoom(member.id))
        .emit('newMessageToClient', { ...newMessageToClient, members });
    });

    return (this.server as any)
      .to(conversationId)
      .emit('messageToClientConversation', newMessageToClient);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    try {
      const userData = this.authService.validateTokenFromHeaders(
        client.handshake.headers,
      );

      if (userData) {
        // this.userService.removeUserDetailMessengerSocketClientId(userData.userId, client.id)
        client.leave(getUserRoom(userData.userId));
      }
    } catch (err) {}
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    try {
      const userData = this.authService.validateTokenFromHeaders(
        client.handshake.headers,
      );

      if (userData) {
        // this.userService.addUserDetailMessengerSocketClientId(userData.userId, client.id)
        client.join(getUserRoom(userData.userId));
        return this.logger.log(`Client is connected: ${client.id}`);
      }
    } catch (err) {}

    client.disconnect(true);
    return this.logger.log(
      `Client is auto disconnected because unauthorize: ${client.id}`,
    );
  }

  public sendNotificationMessage(toUserId: string, data: any): void {
    (this.server as any)
      .to(getUserRoom(toUserId))
      .emit('newNotificationMessage', { data });
  }
}
