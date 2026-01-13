// routes/informes-sociales.routes.ts
// Single Responsibility: Rutas para InformeSocial

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { InformeSocialController } from '@/controllers/InformeSocialController'
import { validateRequest } from '@/middleware/validation'

const router = Router()
const informeSocialController = new InformeSocialController()

// GET /api/v1/informes-sociales - Get all informes sociales with pagination and filters
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  validateRequest,
  informeSocialController.getAllInformesSociales
)

// GET /api/v1/informes-sociales/:id - Get informe social by ID
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid informe social ID')],
  validateRequest,
  informeSocialController.getInformeSocialById
)

// POST /api/v1/informes-sociales - Create new informe social
router.post(
  '/',
  [
    body('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id'),
    body('nombres_apellidos').optional().trim().isString(),
    body('edad').optional().isInt({ min: 0, max: 150 }).withMessage('Edad must be between 0 and 150'),
    body('estado_civil').optional().trim().isString(),
    body('grado_instruccion').optional().trim().isString(),
    body('direccion').optional().trim().isString(),
    body('motivo').optional().trim().isString(),
    body('situacion_familiar').optional().isString().withMessage('Situación familiar must be a string'),
    body('situacion_economica').optional().isString().withMessage('Situación económica must be a string'),
    body('vivienda').optional().isString().withMessage('Vivienda must be a string'),
    body('educacion').optional().isString().withMessage('Educación must be a string'),
    body('problema_social').optional().isString().withMessage('Problema social must be a string'),
    body('apreciacion_profesional').optional().trim().isString(),
    body('lugar').optional().trim().isString(),
    body('fecha').optional().isISO8601().withMessage('Fecha must be a valid date'),
  ],
  validateRequest,
  informeSocialController.createInformeSocial
)

// PUT /api/v1/informes-sociales/:id - Update informe social
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid informe social ID'),
    body('estudiante_id').optional().isUUID().withMessage('Invalid estudiante_id'),
    body('nombres_apellidos').optional().trim().isString(),
    body('edad').optional().isInt({ min: 0, max: 150 }),
    body('estado_civil').optional().trim().isString(),
    body('grado_instruccion').optional().trim().isString(),
    body('direccion').optional().trim().isString(),
    body('motivo').optional().trim().isString(),
    body('situacion_familiar').optional().isString().withMessage('Situación familiar must be a string'),
    body('situacion_economica').optional().isString().withMessage('Situación económica must be a string'),
    body('vivienda').optional().isString().withMessage('Vivienda must be a string'),
    body('educacion').optional().isString().withMessage('Educación must be a string'),
    body('problema_social').optional().isString().withMessage('Problema social must be a string'),
    body('apreciacion_profesional').optional().trim().isString(),
    body('lugar').optional().trim().isString(),
    body('fecha').optional().isISO8601().withMessage('Fecha must be a valid date'),
  ],
  validateRequest,
  informeSocialController.updateInformeSocial
)

// DELETE /api/v1/informes-sociales/:id - Delete informe social
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid informe social ID')],
  validateRequest,
  informeSocialController.deleteInformeSocial
)

export default router
