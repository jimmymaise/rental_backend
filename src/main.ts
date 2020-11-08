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
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}

bootstrap();
