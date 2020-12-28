import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';

import { WebsocketAuthGuard } from '../auth/ws-auth.guard'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'

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
  return `messenger-room-${userId}`
}

@WebSocketGateway({namespace: '/messenger'})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  // @SubscribeMessage('msgToServer')
  // public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
  //   return (this.server as any).to(payload.room).emit('msgToClient', payload);
  // }

  // @UseGuards(WebsocketAuthGuard)
  // @SubscribeMessage('joinRoom')
  // public joinRoom(client: Socket, { room, user }): void {
  //   console.log('currentUser', user)
  //   client.join(room);
  //   client.emit('joinedRoom', room);
  // }

  // @SubscribeMessage('leaveRoom')
  // public leaveRoom(client: Socket, room: string): void {
  //   client.leave(room);
  //   client.emit('leftRoom', room);
  // }
  @UseGuards(WebsocketAuthGuard)
  @SubscribeMessage('sendMessageToOtherUser')
  public joinRoom(client: Socket, { message, toUserId }): void {
    return (this.server as any).to(getUserRoom(toUserId)).emit('msgToClient', { message });
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    try {
      const userData = this.authService.validateTokenFromHeaders(client.handshake.headers)

      if (userData) {
        // this.userService.removeUserDetailMessengerSocketClientId(userData.userId, client.id)
        client.leave(getUserRoom(userData.userId));
      }
    } catch (err) {

    }
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(
    client: Socket
  ): void {
    try {
      const userData = this.authService.validateTokenFromHeaders(client.handshake.headers)

      if (userData) {
        // this.userService.addUserDetailMessengerSocketClientId(userData.userId, client.id)
        client.join(getUserRoom(userData.userId));
        return this.logger.log(`Client is connected: ${client.id}`);
      }
    } catch (err) {

    }

    client.disconnect(true);
    return this.logger.log(`Client is auto disconnected because unauthorize: ${client.id}`);
  }
}