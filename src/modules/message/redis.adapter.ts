// socket.io-redis 6.x
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { createAdapter } from 'socket.io-redis';
// import { RedisClient } from 'redis';
// import { ConfigService } from '@nestjs/config';

// export class RedisIoAdapter extends IoAdapter {
//   constructor(app, private readonly configService: ConfigService) {
//     super(app)
//   }

//   createIOServer(port: number): any {
//     const server = super.createIOServer(port);
//     const pubClient = new RedisClient({ host: this.configService.get('REDIS_HOST'), port: parseInt(this.configService.get('REDIS_PORT')) });
//     const subClient = pubClient.duplicate();
//     const redisAdapter = createAdapter({ pubClient, subClient });
//     server.adapter(redisAdapter);
//     return server;
//   }
// }
// socket.io-redis 5.x
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import redisIoAdapter from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
  constructor(app, private readonly configService: ConfigService) {
    super(app);
  }

  createIOServer(port: number): any {
    const server = super.createIOServer(port);
    const redisAdapter = redisIoAdapter({
      host: this.configService.get('REDIS_HOST'),
      port: parseInt(this.configService.get('REDIS_PORT')),
    });
    server.adapter(redisAdapter);
    return server;
  }
}
