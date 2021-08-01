// socket.io-redis 6.x
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from 'socket.io-redis';
import { RedisClient } from 'redis';
import { ServerOptions } from 'socket.io';

const pubClient = new RedisClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
});
const subClient = pubClient.duplicate();
const redisAdapter = createAdapter({ pubClient, subClient });

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'http://localhost:3700',
          'http://localhost:3600',
          'http://localhost:3500',
          'https://stag.thuedo.vn',
          'https://portal.thuedo.vn',
          'https://stag-portal.thuedo.vn',
          'https://thuedo.vn',
          'https://stag-host.thuedo.vn',
          'https://host.thuedo.vn',
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        credentials: true,
      },
    });
    server.adapter(redisAdapter);
    return server;
  }
}
// socket.io-redis 5.x
// import { ConfigService } from '@nestjs/config';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import redisIoAdapter from 'socket.io-redis';

// export class RedisIoAdapter extends IoAdapter {
//   constructor(app, private readonly configService: ConfigService) {
//     super(app);
//   }

//   createIOServer(port: number): any {
//     const server = super.createIOServer(port);
//     const redisAdapter = redisIoAdapter({
//       host: this.configService.get('REDIS_HOST'),
//       port: parseInt(this.configService.get('REDIS_PORT')),
//     });
//     server.adapter(redisAdapter);
//     return server;
//   }
// }
