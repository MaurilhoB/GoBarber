import ICacheProvider from '../models/ICacheProvider';
import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.redis);
  }
  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const cachedData = await this.client.get(key);

    if (!cachedData) {
      return null;
    }

    return JSON.parse(cachedData) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(key: string) {
    const keys = await this.client.keys(`${key}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
