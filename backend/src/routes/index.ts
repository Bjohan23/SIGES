import { Router } from 'express';
import path from 'path';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import dashboardRoutes from './dashboard.routes';
import fichasSocialesRoutes from './fichas-sociales.routes';
import estudiantesRoutes from './estudiantes.routes';
import { generalRateLimit } from '@/middleware/rateLimit';
import { authenticateToken } from '@/middleware/auth';
import { serveImage } from '@/middleware/imageHandler';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalRateLimit);

// Health check endpoint (no authentication required)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API version info
router.get('/version', (req, res) => {
  res.status(200).json({
    version: process.env.npm_package_version || '1.0.0',
    name: 'SIGES Backend',
    description: 'Sistema de Gestión Social Backend',
    apiVersion: 'v1',
  });
});

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount user routes (protected)
router.use('/users', authenticateToken, usersRoutes);

// Mount dashboard routes (protected)
router.use('/dashboard', authenticateToken, dashboardRoutes);

// Protected routes (require authentication)
router.use('/api/v1', authenticateToken, (req, res, next) => {
  // Add API version header
  res.setHeader('API-Version', '1.0.0');
  next();
});

// API routes
router.use('/api/v1/fichas-sociales', fichasSocialesRoutes);
router.use('/api/v1/estudiantes', estudiantesRoutes);
// router.use('/api/v1/entrevistas', entrevistasRoutes);
// router.use('/api/v1/usuarios', usuariosRoutes);
// router.use('/api/v1/roles', rolesRoutes);

// Static images route (no authentication required for images)
router.get('/images/fichas-sociales/:filename', serveImage);

// API documentation route (if enabled)
if (process.env.SWAGGER_ENABLED === 'true') {
  router.get('/api-docs', (req, res) => {
    res.json({
      message: 'API Documentation',
      documentation: '/api-docs',
      version: '1.0.0',
    });
  });
}

export default router;