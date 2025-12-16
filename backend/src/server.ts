import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from '@/config/database';
import { specs, swaggerUi, swaggerUiOptions } from '@/config/swagger';
import { logger } from '@/utils/logger';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { securityHeaders, corsMiddleware, detectSuspiciousRequests, requestSizeLimit } from '@/middleware/security';
import routes from '@/routes';

// Import type for request handling
import { Request, Response, NextFunction } from 'express';

class Server {
  private app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS configuration - PERMITIR TODOS LOS ORÍGENES SIN RESTRICCIONES
    this.app.use(cors({
      origin: '*', // Permitir todos los orígenes
      credentials: false, // Deshabilitar credenciales para evitar errores
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: '*', // Permitir todos los headers
      optionsSuccessStatus: 200,
      preflightContinue: false
    }));

    // Handle preflight requests - PERMITIR TODO
    this.app.options('*', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', '*');
      res.header('Access-Control-Max-Age', '86400');
      return res.status(200).send();
    });

    // Security middleware (after CORS)
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable to prevent CORS issues
    }));

    // Compression
    this.app.use(compression());

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.http(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentLength: req.headers['content-length'],
      });
      next();
    });

    // Security checks
    this.app.use(detectSuspiciousRequests);

    // Ensure CORS headers are always included - PERMITIR TODO
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    });

    // Trust proxy for IP detection
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check before authentication
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
      });
    });

    // API routes
    this.app.use('/', routes);

    // 404 handler
    this.app.use(notFoundHandler);
  }

  private initializeSwagger(): void {
    if (process.env.SWAGGER_ENABLED !== 'false') {
      this.app.use(
        process.env.SWAGGER_PATH || '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(specs, swaggerUiOptions)
      );

      logger.info('Swagger documentation enabled at /api-docs');
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`Server started successfully on port ${this.port}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

        if (process.env.SWAGGER_ENABLED !== 'false') {
          logger.info(`API Documentation: http://localhost:${this.port}/api-docs`);
        }
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      try {
        // Close database connection
        await disconnectDatabase();

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Handle signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      shutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      shutdown('unhandledRejection');
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

export default Server;