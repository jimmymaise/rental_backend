import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WebsocketCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    console.log('aaa', context.switchToWs().getClient())
    console.log('bb', context.switchToWs().getData())
    return {}
  },
);
