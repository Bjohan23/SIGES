// routes/registros-visitas-domiciliarias.routes.ts
// Routes for Registro de Visita Domiciliaria

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '@/middleware/validation'
import { authenticateToken } from '@/middleware/auth'
import { RegistroVisitaDomiciliariaController } from '@/controllers/RegistroVisitaDomiciliariaController'

const router = Router()
const registroVisitaDomiciliariaController = new RegistroVisitaDomiciliariaController()

// Apply authentication to all routes
router.use(authenticateToken)

/**
 * @route   GET /api/v1/registros-visitas-domiciliarias
 * @desc    Get all registros de visita domiciliaria with pagination
 * @access  Private
 */
router.get('/', [
  // Validation
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isString(),
  validateRequest,
], registroVisitaDomiciliariaController.getAllRegistrosVisitasDomiciliarias)

/**
 * @route   GET /api/v1/registros-visitas-domiciliarias/:id
 * @desc    Get a registro de visita domiciliaria by ID
 * @access  Private
 */
router.get('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], registroVisitaDomiciliariaController.getRegistroVisitaDomiciliariaById)

/**
 * @route   POST /api/v1/registros-visitas-domiciliarias
 * @desc    Create a new registro de visita domiciliaria
 * @access  Private
 */
router.post('/', [
  // Validation
  body('nombre_entrevistado').optional().trim().isString().isLength({ max: 255 }),
  body('domicilio').optional().trim().isString().isLength({ max: 500 }),
  body('fecha_visita').optional().isISO8601().withMessage('Fecha visita must be a valid date'),
  body('responsable').optional().trim().isString().isLength({ max: 255 }),
  body('objetivo').optional().trim().isString(),
  body('relato').optional().trim().isString(),
  validateRequest,
], registroVisitaDomiciliariaController.createRegistroVisitaDomiciliaria)

/**
 * @route   PUT /api/v1/registros-visitas-domiciliarias/:id
 * @desc    Update a registro de visita domiciliaria
 * @access  Private
 */
router.put('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  body('nombre_entrevistado').optional().trim().isString().isLength({ max: 255 }),
  body('domicilio').optional().trim().isString().isLength({ max: 500 }),
  body('fecha_visita').optional().isISO8601().withMessage('Fecha visita must be a valid date'),
  body('responsable').optional().trim().isString().isLength({ max: 255 }),
  body('objetivo').optional().trim().isString(),
  body('relato').optional().trim().isString(),
  validateRequest,
], registroVisitaDomiciliariaController.updateRegistroVisitaDomiciliaria)

/**
 * @route   DELETE /api/v1/registros-visitas-domiciliarias/:id
 * @desc    Delete a registro de visita domiciliaria
 * @access  Private
 */
router.delete('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], registroVisitaDomiciliariaController.deleteRegistroVisitaDomiciliaria)

export default router
