// routes/cronicas-casos-sociales.routes.ts
// Routes for Crónica de Caso Social

import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '@/middleware/validation'
import { authenticateToken } from '@/middleware/auth'
import { CronicaCasoSocialController } from '@/controllers/CronicaCasoSocialController'

const router = Router()
const cronicaCasoSocialController = new CronicaCasoSocialController()

// Apply authentication to all routes
router.use(authenticateToken)

/**
 * @route   GET /api/v1/cronicas-casos-sociales
 * @desc    Get all crónicas de caso social with pagination
 * @access  Private
 */
router.get('/', [
  // Validation
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isString(),
  validateRequest,
], cronicaCasoSocialController.getAllCronicasCasosSociales)

/**
 * @route   GET /api/v1/cronicas-casos-sociales/:id
 * @desc    Get a crónica de caso social by ID
 * @access  Private
 */
router.get('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], cronicaCasoSocialController.getCronicaCasoSocialById)

/**
 * @route   POST /api/v1/cronicas-casos-sociales
 * @desc    Create a new crónica de caso social
 * @access  Private
 */
router.post('/', [
  // Validation
  body('nombres_apellidos').optional().trim().isString().isLength({ max: 255 }),
  body('num_reunion').optional().isInt(),
  body('fecha_hora').optional().isISO8601().toDate(),
  body('asistentes').optional().trim().isString(),
  body('actividades_realizadas').optional().trim().isString(),
  body('programas').optional().trim().isString(),
  body('relato').optional().trim().isString(),
  body('interpretacion').optional().trim().isString(),
  body('sugerencias').optional().trim().isString(),
  validateRequest,
], cronicaCasoSocialController.createCronicaCasoSocial)

/**
 * @route   PUT /api/v1/cronicas-casos-sociales/:id
 * @desc    Update a crónica de caso social
 * @access  Private
 */
router.put('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  body('nombres_apellidos').optional().trim().isString().isLength({ max: 255 }),
  body('num_reunion').optional().isInt(),
  body('fecha_hora').optional().isISO8601().toDate(),
  body('asistentes').optional().trim().isString(),
  body('actividades_realizadas').optional().trim().isString(),
  body('programas').optional().trim().isString(),
  body('relato').optional().trim().isString(),
  body('interpretacion').optional().trim().isString(),
  body('sugerencias').optional().trim().isString(),
  validateRequest,
], cronicaCasoSocialController.updateCronicaCasoSocial)

/**
 * @route   DELETE /api/v1/cronicas-casos-sociales/:id
 * @desc    Delete a crónica de caso social
 * @access  Private
 */
router.delete('/:id', [
  // Validation
  param('id').isUUID().withMessage('Invalid ID format'),
  validateRequest,
], cronicaCasoSocialController.deleteCronicaCasoSocial)

export default router
