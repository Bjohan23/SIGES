import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Often causes issues in development
});

// Compression middleware
export const compressResponse = compression();

// CORS middleware
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

  if (allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
};

// Request size limiter
export const requestSizeLimit = (maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];

    if (contentLength && parseInt(contentLength) > maxSize) {
      res.status(413).json({
        success: false,
        error: {
          message: 'Request entity too large',
          statusCode: 413,
        },
      });
      return;
    }

    next();
  };
};

// IP whitelist middleware
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (!allowedIPs.includes(clientIP || '')) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied from this IP',
          statusCode: 403,
        },
      });
      return;
    }

    next();
  };
};

// Detect suspicious requests
export const detectSuspiciousRequests = (req: Request, res: Response, next: NextFunction): void => {
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // XSS attempt
    /javascript:/i, // JavaScript injection
    /union.*select/i, // SQL injection attempt
  ];

  const checkString = (str: string): boolean => {
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  // Check URL and query parameters
  if (checkString(req.url) || checkString(JSON.stringify(req.query))) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Suspicious request detected',
        statusCode: 400,
      },
    });
    return;
  }

  // Check request body if it exists
  if (req.body && typeof req.body === 'object') {
    if (checkString(JSON.stringify(req.body))) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Suspicious request detected',
          statusCode: 400,
        },
      });
      return;
    }
  }

  next();
};