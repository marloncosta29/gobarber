import Redis, { Redis as RedisInterface } from 'ioredis';
import ICacheProvider from '../models/ICacheProvider';
import cacheConfig from '@config/cache';
export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisInterface;
  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }
  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }
  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    const parseData: T = JSON.parse(data);
    return parseData;
  }
  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = await this.client.pipeline();
    keys.forEach(key => pipeline.del(key));
    await pipeline.exec();
  }
}
