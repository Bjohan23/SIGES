// routes/situaciones-socio-familiares.routes.ts
// Routes for Situación Socio Familiar

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '@/middleware/validation'
import { authenticateToken } from '@/middleware/auth'
import { SituacionSocioFamiliarController } from '@/controllers/SituacionSocioFamiliarController'

const router = Router()
const situacionSocioFamiliarController = new SituacionSocioFamiliarController()

// Apply authentication to all routes
router.use(authenticateToken)

/**
 * @route   GET /api/v1/situaciones-socio-familiares
 * @desc    Get all situaciones socio familiares with pagination
 * @access  Private
 */
router.get('/', [
  // Validation
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isString(),
  validateRequest,
], situacionSocioFamiliarController.getAllSituacionesSocioFamiliares)

/**
 * @route   GET /api/v1/situaciones-socio-familiares/:id
 * @desc    Get a situación socio familiar by ID
 * @access  Private
 */
router.get('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], situacionSocioFamiliarController.getSituacionSocioFamiliarById)

/**
 * @route   POST /api/v1/situaciones-socio-familiares
 * @desc    Create a new situación socio familiar
 * @access  Private
 */
router.post('/', [
  // Validation
  body('subsistema_conyugal').optional().trim().isString(),
  body('subsistema_paterno_fiscal').optional().trim().isString(),
  body('subsistema_fraternal').optional().trim().isString(),
  body('solidaridad_familiar').optional().trim().isString(),
  body('relaciones').optional().trim().isString(),
  body('desempeno_roles').optional().trim().isString(),
  body('relaciones_crianza').optional().trim().isString(),
  body('relaciones_exogrupo').optional().trim().isString(),
  body('pautas_vida_familiar').optional().trim().isString(),
  validateRequest,
], situacionSocioFamiliarController.createSituacionSocioFamiliar)

/**
 * @route   PUT /api/v1/situaciones-socio-familiares/:id
 * @desc    Update a situación socio familiar
 * @access  Private
 */
router.put('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  body('subsistema_conyugal').optional().trim().isString(),
  body('subsistema_paterno_fiscal').optional().trim().isString(),
  body('subsistema_fraternal').optional().trim().isString(),
  body('solidaridad_familiar').optional().trim().isString(),
  body('relaciones').optional().trim().isString(),
  body('desempeno_roles').optional().trim().isString(),
  body('relaciones_crianza').optional().trim().isString(),
  body('relaciones_exogrupo').optional().trim().isString(),
  body('pautas_vida_familiar').optional().trim().isString(),
  validateRequest,
], situacionSocioFamiliarController.updateSituacionSocioFamiliar)

/**
 * @route   DELETE /api/v1/situaciones-socio-familiares/:id
 * @desc    Delete a situación socio familiar
 * @access  Private
 */
router.delete('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], situacionSocioFamiliarController.deleteSituacionSocioFamiliar)

export default router
