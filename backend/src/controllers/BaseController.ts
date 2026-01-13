import { Request, Response, NextFunction } from 'express';
import { IController, IPaginationQuery } from '@/interfaces/IController';
import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export abstract class BaseController implements IController {
  protected handleRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    return Promise.resolve();
  }

  protected success(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  protected error(res: Response, error: AppError, statusCode: number = error.statusCode): void {
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message,
        statusCode,
        isOperational: error.isOperational,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Alias methods for backward compatibility
  protected sendSuccess(res: Response, statusCode: number, data: any, message?: string): void {
    res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  protected sendError(res: Response, statusCode: number, message: string, details?: any): void {
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        isOperational: statusCode < 500,
        details
      },
      timestamp: new Date().toISOString(),
    });
  }

  protected paginated(res: Response, data: any, pagination: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    });
  }

  protected created(res: Response, data: any): void {
    this.success(res, data, 201);
  }

  protected noContent(res: Response): void {
    res.status(204).send();
  }

  protected notFound(res: Response, message: string = 'Resource not found'): void {
    res.status(404).json({
      success: false,
      error: {
        message,
        statusCode: 404,
      },
      timestamp: new Date().toISOString(),
    });
  }

  protected unauthorized(res: Response, message: string = 'Unauthorized'): void {
    res.status(401).json({
      success: false,
      error: {
        message,
        statusCode: 401,
      },
      timestamp: new Date().toISOString(),
    });
  }

  protected getPaginationQuery(req: Request): IPaginationQuery {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const sortBy = req.query.sortBy as string || 'created_at';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    return {
      page,
      limit,
      sortBy,
      sortOrder,
    };
  }

  protected getUserIdFromRequest(req: Request): string | null {
    const user = (req as any).user;
    return user?.sub || user?.id || null;
  }

  protected asyncHandler(
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await handler(req, res, next);
      } catch (error) {
        logger.error('Controller error:', {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          url: req.url,
          method: req.method,
          ip: req.ip,
          userId: this.getUserIdFromRequest(req),
        });

        if (error instanceof AppError) {
          return this.error(res, error);
        }

        // Handle Prisma errors
        if (error instanceof Error && (error as any).name === 'PrismaClientKnownRequestError') {
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
          }

          return this.error(res, new AppError(message, statusCode));
        }

        // Generic server error
        this.error(res, new AppError('Internal server error', 500));
      }
    };
  }

  protected validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
  }

  protected sanitizeInput(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Basic XSS protection
        sanitized[key] = value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  protected logRequest(req: Request, action: string): void {
    logger.info('Controller request', {
      action,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: this.getUserIdFromRequest(req),
    });
  }

  protected logResponse(req: Request, statusCode: number, duration: number): void {
    logger.info('Controller response', {
      method: req.method,
      url: req.url,
      statusCode,
      duration: `${duration}ms`,
      userId: this.getUserIdFromRequest(req),
    });
  }
}