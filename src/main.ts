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

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3500, https://*.thuedo.vn, https://thuedo.vn");
    res.header("Access-Control-Allow-Headers", "Authorization");
    res.header('Access-Control-Allow-Credentials', true)
    next();
  });

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}

bootstrap();
