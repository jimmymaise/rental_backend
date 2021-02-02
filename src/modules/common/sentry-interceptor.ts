import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Sentry from '@sentry/minimal';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(null, (exception) => {
        Sentry.captureException(exception);
      }),
    );
  }
}

// Example
// import { Controller, Get, UseInterceptors, InternalServerErrorException } from '@nestjs/common';
// import { AppService } from './app.service';
// import { SentryInterceptor } from './sentry.interceptor';

// @UseInterceptors(SentryInterceptor)
// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     throw new InternalServerErrorException();
//     return this.appService.getHello();
//   }
// }
