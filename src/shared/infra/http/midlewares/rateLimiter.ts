import AppError from '@shared/errors/app-errors';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT),
  // password: process.env.REDIS_PASS,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 5,
  duration: 1,
});

export default async function rateLimit(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    await rateLimiter.consume(request.ip);
    return next();
  } catch (error) {
    throw new AppError('Too many request', 429);
  }
}
