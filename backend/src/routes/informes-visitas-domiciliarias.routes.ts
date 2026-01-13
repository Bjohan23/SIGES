// routes/informes-visitas-domiciliarias.routes.ts
// Routes for Informe de Visita Domiciliaria

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '@/middleware/validation'
import { authenticateToken } from '@/middleware/auth'
import { InformeVisitaDomiciliariaController } from '@/controllers/InformeVisitaDomiciliariaController'

const router = Router()
const informeVisitaDomiciliariaController = new InformeVisitaDomiciliariaController()

// Apply authentication to all routes
router.use(authenticateToken)

/**
 * @route   GET /api/v1/informes-visitas-domiciliarias
 * @desc    Get all informes de visita domiciliaria with pagination
 * @access  Private
 */
router.get('/', [
  // Validation
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isString(),
  validateRequest,
], informeVisitaDomiciliariaController.getAllInformesVisitasDomiciliarias)

/**
 * @route   GET /api/v1/informes-visitas-domiciliarias/:id
 * @desc    Get a informe de visita domiciliaria by ID
 * @access  Private
 */
router.get('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], informeVisitaDomiciliariaController.getInformeVisitaDomiciliariaById)

/**
 * @route   POST /api/v1/informes-visitas-domiciliarias
 * @desc    Create a new informe de visita domiciliaria
 * @access  Private
 */
router.post('/', [
  // Validation
  body('nombres_apellidos').optional().trim().isString().isLength({ max: 255 }),
  body('direccion').optional().trim().isString().isLength({ max: 500 }),
  body('motivo').optional().trim().isString(),
  body('objetivos').optional().trim().isString(),
  body('narracion').optional().trim().isString(),
  body('conclusiones').optional().trim().isString(),
  validateRequest,
], informeVisitaDomiciliariaController.createInformeVisitaDomiciliaria)

/**
 * @route   PUT /api/v1/informes-visitas-domiciliarias/:id
 * @desc    Update a informe de visita domiciliaria
 * @access  Private
 */
router.put('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  body('nombres_apellidos').optional().trim().isString().isLength({ max: 255 }),
  body('direccion').optional().trim().isString().isLength({ max: 500 }),
  body('motivo').optional().trim().isString(),
  body('objetivos').optional().trim().isString(),
  body('narracion').optional().trim().isString(),
  body('conclusiones').optional().trim().isString(),
  validateRequest,
], informeVisitaDomiciliariaController.updateInformeVisitaDomiciliaria)

/**
 * @route   DELETE /api/v1/informes-visitas-domiciliarias/:id
 * @desc    Delete a informe de visita domiciliaria
 * @access  Private
 */
router.delete('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], informeVisitaDomiciliariaController.deleteInformeVisitaDomiciliaria)

export default router
