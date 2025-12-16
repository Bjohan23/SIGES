import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { FichaSocialController } from '@/controllers/FichaSocialController';
import { validateRequest } from '@/middleware/validation';

const router = Router();
const fichaSocialController = new FichaSocialController();

// Get all fichas sociales
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('estado').optional().isIn(['INCOMPLETA', 'COMPLETA', 'EN_REVISION', 'APROBADA', 'RECHAZADA']).withMessage('Invalid estado value'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('distrito').optional().isString().withMessage('Distrito must be a string'),
  ],
  validateRequest,
  fichaSocialController.getAllFichas
);

// Get ficha social by ID
router.get('/:id',
  [
    param('id').isUUID().withMessage('Invalid ficha ID format'),
  ],
  validateRequest,
  fichaSocialController.getFichaById
);

// Create new ficha social
router.post('/',
  [
    body('nombres').notEmpty().withMessage('Nombres are required'),
    body('apellidos').notEmpty().withMessage('Apellidos are required'),
    body('fecha_nacimiento').isISO8601().withMessage('Valid fecha_nacimiento is required'),
    body('domicilio_actual').notEmpty().withMessage('Domicilio actual is required'),
    body('distrito').notEmpty().withMessage('Distrito is required'),
    body('dni').optional().isString().withMessage('DNI must be a string'),
    body('sexo').optional().isIn(['M', 'F']).withMessage('Sex must be M or F'),
    body('nacionalidad').optional().isString().withMessage('Nacionalidad must be a string'),
    body('nivel_educativo').optional().isString().withMessage('Nivel educativo must be a string'),
    body('estado_civil').optional().isIn(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONVIVIENTE']).withMessage('Invalid estado civil'),
    body('num_hijos').optional().isInt({ min: 0 }).withMessage('Number of children must be a non-negative integer'),
  ],
  validateRequest,
  fichaSocialController.createFicha
);

// Update ficha social
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid ficha ID format'),
    body('nombres').optional().notEmpty().withMessage('Nombres cannot be empty'),
    body('apellidos').optional().notEmpty().withMessage('Apellidos cannot be empty'),
    body('fecha_nacimiento').optional().isISO8601().withMessage('Valid fecha_nacimiento is required'),
    body('domicilio_actual').optional().notEmpty().withMessage('Domicilio actual cannot be empty'),
    body('distrito').optional().notEmpty().withMessage('Distrito cannot be empty'),
  ],
  validateRequest,
  fichaSocialController.updateFicha
);

// Delete ficha social
router.delete('/:id',
  [
    param('id').isUUID().withMessage('Invalid ficha ID format'),
  ],
  validateRequest,
  fichaSocialController.deleteFicha
);

export default router;