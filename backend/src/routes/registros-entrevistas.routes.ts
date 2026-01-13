// routes/registros-entrevistas.routes.ts
// Single Responsibility: Rutas para RegistroEntrevista

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { RegistroEntrevistaController } from '@/controllers/RegistroEntrevistaController'
import { validateRequest } from '@/middleware/validation'

const router = Router()
const registroEntrevistaController = new RegistroEntrevistaController()

// GET /api/v1/registros-entrevistas - Get all registros de entrevista with pagination and filters
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  validateRequest,
  registroEntrevistaController.getAllRegistrosEntrevistas
)

// GET /api/v1/registros-entrevistas/:id - Get registro de entrevista by ID
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid registro entrevista ID')],
  validateRequest,
  registroEntrevistaController.getRegistroEntrevistaById
)

// POST /api/v1/registros-entrevistas - Create new registro de entrevista
router.post(
  '/',
  [
    body('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id'),
    body('lugar').optional().trim().isString(),
    body('fecha').optional().isISO8601().withMessage('Fecha must be a valid date'),
    body('hora').optional().trim().isString(),
    body('tema').optional().trim().isString(),
    body('objetivo').optional().trim().isString(),
    body('entrevistado').optional().trim().isString(),
    body('entrevistador').optional().trim().isString(),
    body('descripcion_relato').optional().trim().isString(),
  ],
  validateRequest,
  registroEntrevistaController.createRegistroEntrevista
)

// PUT /api/v1/registros-entrevistas/:id - Update registro de entrevista
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid registro entrevista ID'),
    body('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id'),
    body('lugar').optional().trim().isString(),
    body('fecha').optional().isISO8601().withMessage('Fecha must be a valid date'),
    body('hora').optional().trim().isString(),
    body('tema').optional().trim().isString(),
    body('objetivo').optional().trim().isString(),
    body('entrevistado').optional().trim().isString(),
    body('entrevistador').optional().trim().isString(),
    body('descripcion_relato').optional().trim().isString(),
  ],
  validateRequest,
  registroEntrevistaController.updateRegistroEntrevista
)

// DELETE /api/v1/registros-entrevistas/:id - Delete registro de entrevista
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid registro entrevista ID')],
  validateRequest,
  registroEntrevistaController.deleteRegistroEntrevista
)

export default router
