import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import * as Sentry from '@sentry/node';

@Plugin()
export class ApolloServerSentryPlugin implements ApolloServerPlugin {
  requestDidStart(): GraphQLRequestListener {
    return {
      didEncounterErrors(rc) {
        Sentry.withScope((scope) => {
          scope.addEventProcessor((event) =>
            Sentry.Handlers.parseRequest(event, (rc.context as any).req),
          );

          // public user email
          const userEmail = (rc.context as any).req?.session?.userId;
          if (userEmail) {
            scope.setUser({
              // id?: string;
              ip_address: (rc.context as any).req?.ip,
              email: userEmail,
            });
          }

          scope.setTags({
            graphql: rc.operation?.operation || 'parse_err',
            graphqlName:
              (rc.operationName as any) || (rc.request.operationName as any),
          });

          rc.errors.forEach((error) => {
            if (error.path || error.name !== 'GraphQLError') {
              scope.setExtras({
                path: error.path,
              });
              Sentry.captureException(error);
            } else {
              scope.setExtras({});
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      },
    };
  }
}
