import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Ensure CORS headers are always included, even for errors
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    let statusCode = 500;
    let message = 'Database operation failed';

    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint violation';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid relation violation';
        break;
      case 'P2011':
        statusCode = 400;
        message = 'Null constraint violation';
        break;
      case 'P2012':
        statusCode = 400;
        message = 'Missing a required value';
        break;
      case 'P2013':
        statusCode = 400;
        message = 'Missing a required argument';
        break;
    }

    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        code: prismaError.code,
        isOperational: false,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        statusCode: 400,
        isOperational: false,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token',
        statusCode: 401,
        isOperational: false,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        message: 'Token expired',
        statusCode: 401,
        isOperational: false,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
      statusCode: 500,
      isOperational: false,
    },
    timestamp: new Date().toISOString(),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  // Ensure CORS headers are included in 404 responses
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  logger.warn(`Route not found: ${req.method} ${req.url}`);

  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
      isOperational: true,
    },
    timestamp: new Date().toISOString(),
  });
}