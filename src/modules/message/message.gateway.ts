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

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  GuardUserPayload
} from '../auth/auth.dto';
import { WebsocketCurrentUser } from '../auth/ws-current-user.decorator'
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

@WebSocketGateway({namespace: '/messenger'})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    return (this.server as any).to(payload.room).emit('msgToClient', payload);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string, @WebsocketCurrentUser() currentUser): void {
    console.log('currentUser', currentUser)
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    try {
      const userData = this.authService.validateTokenFromHeaders(client.handshake.headers)

      if (userData) {
        this.userService.removeUserDetailMessengerSocketClientId(userData.userId, client.id)
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
        this.userService.addUserDetailMessengerSocketClientId(userData.userId, client.id)
      }
    } catch (err) {

    }
    return this.logger.log(`Client connected: ${client.id}`);
  }
}