import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { prisma } from '../config/database';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export function createRateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = keyGenerator(req);
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    try {
      // Clean up old entries
      await prisma.rateLimit.deleteMany({
        where: {
          clave: key,
          fecha: {
            lt: windowStart,
          },
        },
      });

      // Count current requests in window
      const currentCount = await prisma.rateLimit.count({
        where: {
          clave: key,
          fecha: {
            gte: windowStart,
          },
        },
      });

      if (currentCount >= maxRequests) {
        const oldestRequest = await prisma.rateLimit.findFirst({
          where: {
            clave: key,
          },
          orderBy: {
            fecha: 'asc',
          },
        });

        const resetTime = oldestRequest
          ? new Date(oldestRequest.fecha.getTime() + windowMs)
          : new Date(now.getTime() + windowMs);

        res.set({
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(resetTime.getTime() / 1000).toString(),
        });

        return next(new AppError('Too many requests, please try again later', 429));
      }

      // Record this request
      await prisma.rateLimit.create({
        data: {
          clave: key,
          fecha: now,
        },
      });

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - currentCount - 1).toString(),
        'X-RateLimit-Reset': Math.ceil((now.getTime() + windowMs) / 1000).toString(),
      });

      // Intercept response to handle skip options
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function(data) {
          if ((skipSuccessfulRequests && res.statusCode < 400) ||
              (skipFailedRequests && res.statusCode >= 400)) {
            // Remove this request from rate limit count
            prisma.rateLimit.deleteMany({
              where: {
                clave: key,
                fecha: now,
              },
            }).catch(() => {}); // Ignore errors
          }
          return originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      // If rate limiting fails, allow the request
      next();
    }
  };
}

// Predefined rate limits
export const authRateLimit = process.env.DISABLE_RATE_LIMITING === 'true'
  ? (req: Request, res: Response, next: NextFunction) => next() // Disable rate limiting in development
  : createRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per 15 minutes
    });

export const generalRateLimit = process.env.DISABLE_RATE_LIMITING === 'true'
  ? (req: Request, res: Response, next: NextFunction) => next() // Disable rate limiting in development
  : createRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per 15 minutes
    });

export const apiRateLimit = process.env.DISABLE_RATE_LIMITING === 'true'
  ? (req: Request, res: Response, next: NextFunction) => next() // Disable rate limiting in development
  : createRateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 20, // 20 requests per minute
    });