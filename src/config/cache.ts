import { RedisOptions } from 'ioredis';

interface IChacheConfig {
  driver: string;
  config: {
    redis: RedisOptions;
  };
}
export default {
  driver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASS,
    },
  },
} as IChacheConfig;
