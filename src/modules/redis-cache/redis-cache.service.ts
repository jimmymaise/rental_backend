import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async get(key) {
    return await this.cache.get(key);
  }

  /**
   * 
   * @param key 
   * @param value 
   * @param ttl time to line in seconds
   */
  async set(key, value, ttl: number) {
    return await this.cache.set(key, value, { ttl });
  }
}