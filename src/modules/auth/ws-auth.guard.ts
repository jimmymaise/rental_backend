import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from './auth.service'

@Injectable()
export class WebsocketAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient();
        const user = await this.authService.validateTokenFromHeaders(client.handshake.headers);
        context.switchToWs().getData().user = user;
        return Boolean(user);
    }
}