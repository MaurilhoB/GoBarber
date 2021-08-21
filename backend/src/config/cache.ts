import { RedisOptions } from 'ioredis';
interface ICacheConfig {
  driver: 'redis';
  redis: RedisOptions;
}
export default {
  driver: 'redis',

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
} as ICacheConfig;
