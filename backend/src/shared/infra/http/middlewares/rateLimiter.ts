import { RateLimiterRedis } from 'rate-limiter-flexible';
import { RedisClient } from 'redis';
import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

const redisClient = new RedisClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,

  keyPrefix: 'rate-limiter',
  points: 5,
  duration: 1,
});

const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
};

export default rateLimiter;
