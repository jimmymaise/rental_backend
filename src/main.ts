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
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet(
    { contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }
  ));
  app.use(function(req, res, next) {
    const allowedOrigins = ["http://localhost:3500", "https://*.thuedo.vn", "https://thuedo.vn"]

    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    // res.header("Access-Control-Expose-Headers", "Authorization, set-cookie");
    res.header('Access-Control-Allow-Credentials', true)

    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
  });
  app.use(cookieParser());

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}

bootstrap();
