// routes/entrevistas.routes.ts
// Single Responsibility: Rutas para EntrevistaAplicada

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { EntrevistaController } from '@/controllers/EntrevistaController'
import { validateRequest } from '@/middleware/validation'

const router = Router()
const entrevistaController = new EntrevistaController()

// Get all entrevistas
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('estudiante_nombres').optional().isString().withMessage('Nombres must be a string'),
    query('estudiante_apellidos').optional().isString().withMessage('Apellidos must be a string'),
    query('grado').optional().isString().withMessage('Grado must be a string'),
    query('aula').optional().isString().withMessage('Aula must be a string'),
    query('estado').optional().isString().withMessage('Estado must be a string'),
  ],
  validateRequest,
  entrevistaController.getAllEntrevistas
)

// Search entrevistas by estudiante
router.get(
  '/search/:query',
  [param('query').isString().trim().isLength({ min: 2 }).withMessage('Query must be at least 2 characters')],
  validateRequest,
  entrevistaController.searchEntrevistas
)

// Get statistics
router.get('/statistics', entrevistaController.getStatistics)

// Get entrevista by ID
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid entrevista ID format')],
  validateRequest,
  entrevistaController.getEntrevistaById
)

// Create new entrevista
router.post(
  '/',
  [
    body('estudiante_nombres').notEmpty().withMessage('Estudiante nombres is required'),
    body('estudiante_apellidos').notEmpty().withMessage('Estudiante apellidos is required'),
    body('estudiante_edad').optional().isInt().withMessage('Edad must be an integer'),
    body('estudiante_fecha_nacimiento').optional().isISO8601().withMessage('Valid fecha_nacimiento is required'),
    body('aula').optional().isString().withMessage('Aula must be a string'),
    body('grado').optional().isString().withMessage('Grado must be a string'),
    body('ficha_social_id').optional().isUUID().withMessage('Invalid ficha_social_id format'),
    body('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id format'),
    body('respuestas').optional().isObject().withMessage('Respuestas must be an object'),
    body('estado').optional().isIn(['INCOMPLETA', 'COMPLETA', 'EN_REVISION', 'APROBADA', 'RECHAZADA']).withMessage('Invalid estado value'),
    body('porcentaje_completado').optional().isInt({ min: 0, max: 100 }).withMessage('Porcentaje must be between 0 and 100'),
  ],
  validateRequest,
  entrevistaController.createEntrevista
)

// Update entrevista
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid entrevista ID format'),
    body('estudiante_nombres').optional().notEmpty().withMessage('Estudiante nombres cannot be empty'),
    body('estudiante_apellidos').optional().notEmpty().withMessage('Estudiante apellidos cannot be empty'),
    body('estudiante_edad').optional().isInt().withMessage('Edad must be an integer'),
    body('estudiante_fecha_nacimiento').optional().isISO8601().withMessage('Valid fecha_nacimiento is required'),
    body('aula').optional().isString().withMessage('Aula must be a string'),
    body('grado').optional().isString().withMessage('Grado must be a string'),
    body('ficha_social_id').optional().isUUID().withMessage('Invalid ficha_social_id format'),
    body('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id format'),
    body('respuestas').optional().isObject().withMessage('Respuestas must be an object'),
    body('estado').optional().isIn(['INCOMPLETA', 'COMPLETA', 'EN_REVISION', 'APROBADA', 'RECHAZADA']).withMessage('Invalid estado value'),
    body('porcentaje_completado').optional().isInt({ min: 0, max: 100 }).withMessage('Porcentaje must be between 0 and 100'),
  ],
  validateRequest,
  entrevistaController.updateEntrevista
)

// Update progress
router.patch(
  '/:id/progress',
  [
    param('id').isUUID().withMessage('Invalid entrevista ID format'),
    body('porcentaje').isInt({ min: 0, max: 100 }).withMessage('Porcentaje must be between 0 and 100'),
  ],
  validateRequest,
  entrevistaController.updateProgress
)

// Change estado
router.patch(
  '/:id/estado',
  [
    param('id').isUUID().withMessage('Invalid entrevista ID format'),
    body('estado').isIn(['INCOMPLETA', 'COMPLETA', 'EN_REVISION', 'APROBADA', 'RECHAZADA']).withMessage('Invalid estado value'),
  ],
  validateRequest,
  entrevistaController.changeEstado
)

// Delete entrevista
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid entrevista ID format')],
  validateRequest,
  entrevistaController.deleteEntrevista
)

export default router
