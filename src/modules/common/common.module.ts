import { Module } from '@nestjs/common';

import { ApolloServerLoggingPlugin } from './apollo-server-logging';

@Module({
  providers: [ApolloServerLoggingPlugin],
})
export class CommonModule {}
