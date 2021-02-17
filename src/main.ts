// import { NestFactory } from '@nestjs/core'
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify'

// import { AppModule } from './app.module'

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter()
//   )
//   app.register(require('fastify-multipart'));
//   await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0')
// }

// bootstrap()

import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { RedisIoAdapter } from './modules/message/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    environment: process.env.ENV_NAME,
    // see why we use APP_NAME here: https://github.com/getsentry/sentry-cli/issues/482
    // release: `${process.env.APP_NAME}-${process.env.APP_REVISION}` || '0.0.1',
    dsn: process.env.SENTRY_DSN,
    // integrations: [
    //   // used for rewriting SourceMaps from js to ts
    //   // check that sourcemaps are enabled in tsconfig.js
    //   // read the docs https://docs.sentry.io/platforms/node/typescript/
    //   new RewriteFrames({
    //     root: process.cwd(),
    //   }) as any,
    //   // Output sended data by Sentry to console.log()
    //   // new Debug({ stringify: true }),
    // ],
  });

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new RedisIoAdapter(app, configService));
  app.use(function (req, res, next) {
    const allowedOrigins = [
      'http://localhost:3600',
      'http://localhost:3500',
      'https://stag.thuedo.vn',
      'https://thuedo.vn',
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // res.header("Access-Control-Expose-Headers", "Authorization, set-cookie");
    res.header('Access-Control-Allow-Credentials', true);

    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  app.use(cookieParser());

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}

bootstrap();
