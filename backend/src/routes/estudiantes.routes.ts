import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { EstudianteController } from '@/controllers/EstudianteController';
import { validateRequest } from '@/middleware/validation';

const router = Router();
const estudianteController = new EstudianteController();

// Get all estudiantes
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('codigo').optional().isString().withMessage('Codigo must be a string'),
    query('nombres').optional().isString().withMessage('Nombres must be a string'),
    query('apellido_paterno').optional().isString().withMessage('Apellido paterno must be a string'),
    query('apellido_materno').optional().isString().withMessage('Apellido materno must be a string'),
    query('dni').optional().isString().withMessage('DNI must be a string'),
    query('activo').optional().isBoolean().withMessage('Activo must be a boolean'),
  ],
  validateRequest,
  estudianteController.getAllEstudiantes
);

// Search estudiantes by nombre or apellido
router.get('/search/:query',
  [
    param('query').isString().trim().isLength({ min: 2 }).withMessage('Query must be at least 2 characters'),
  ],
  validateRequest,
  estudianteController.searchEstudiantes
);

// Get estudiante by ID
router.get('/:id',
  [
    param('id').isUUID().withMessage('Invalid estudiante ID format'),
  ],
  validateRequest,
  estudianteController.getEstudianteById
);

// Create new estudiante
router.post('/',
  [
    body('codigo').notEmpty().withMessage('Codigo is required'),
    body('apellido_paterno').notEmpty().withMessage('Apellido paterno is required'),
    body('apellido_materno').notEmpty().withMessage('Apellido materno is required'),
    body('nombres').notEmpty().withMessage('Nombres are required'),
    body('fecha_nacimiento').optional().isISO8601().withMessage('Valid fecha_nacimiento is required'),
    body('dni').optional().isString().isLength({ min: 8, max: 8 }).withMessage('DNI must be 8 digits'),
    body('telefono').optional().isString().withMessage('Telefono must be a string'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('direccion').optional().isString().withMessage('Direccion must be a string'),
  ],
  validateRequest,
  estudianteController.createEstudiante
);

// Update estudiante
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid estudiante ID format'),
    body('codigo').optional().notEmpty().withMessage('Codigo cannot be empty'),
    body('apellido_paterno').optional().notEmpty().withMessage('Apellido paterno cannot be empty'),
    body('apellido_materno').optional().notEmpty().withMessage('Apellido materno cannot be empty'),
    body('nombres').optional().notEmpty().withMessage('Nombres cannot be empty'),
    body('fecha_nacimiento').optional().isISO8601().withMessage('Valid fecha_nacimiento is required'),
    body('dni').optional().isString().isLength({ min: 8, max: 8 }).withMessage('DNI must be 8 digits'),
    body('telefono').optional().isString().withMessage('Telefono must be a string'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('direccion').optional().isString().withMessage('Direccion must be a string'),
    body('activo').optional().isBoolean().withMessage('Activo must be a boolean'),
  ],
  validateRequest,
  estudianteController.updateEstudiante
);

// Delete estudiante (soft delete)
router.delete('/:id',
  [
    param('id').isUUID().withMessage('Invalid estudiante ID format'),
  ],
  validateRequest,
  estudianteController.deleteEstudiante
);

export default router;
