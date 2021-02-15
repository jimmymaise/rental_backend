import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

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

  async ping(): Promise<boolean> {
    try {
      const TEST_KEY = 'TEST_KEY_HEALTH_CHECK';
      await this.cache.set(TEST_KEY, 0, { ttl: 10 });
      await this.cache.get(TEST_KEY);
      await this.cache.del(TEST_KEY);

      return true;
    } catch {
      return false;
    }
  }
}
