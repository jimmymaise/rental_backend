import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { Logger } from '@nestjs/common';

@Plugin()
export class ApolloServerLoggingPlugin implements ApolloServerPlugin {
  private logger: Logger = new Logger('ApolloServerLogging');

  requestDidStart(): GraphQLRequestListener {
    this.logger.log('Request started');

    return {
      willSendResponse() {
        const logger: Logger = new Logger('ApolloServerLogging', true);
        logger.log('Will send response');
      },
    };
  }
}
