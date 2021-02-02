import { Module } from '@nestjs/common';

import { ApolloServerLoggingPlugin } from './apollo-server-logging';
import { ApolloServerSentryPlugin } from './apollo-server-sentry';

@Module({
  providers: [ApolloServerLoggingPlugin, ApolloServerSentryPlugin],
})
export class CommonModule {}
