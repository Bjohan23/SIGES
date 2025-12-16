import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import { generalRateLimit } from '@/middleware/rateLimit';
import { authenticateToken } from '@/middleware/auth';

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

// Protected routes (require authentication)
router.use('/api/v1', authenticateToken, (req, res, next) => {
  // Add API version header
  res.setHeader('API-Version', '1.0.0');
  next();
});

// Example protected route structure
// router.use('/api/v1/fichas-sociales', fichasSocialesRoutes);
// router.use('/api/v1/entrevistas', entrevistasRoutes);
// router.use('/api/v1/usuarios', usuariosRoutes);
// router.use('/api/v1/roles', rolesRoutes);

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