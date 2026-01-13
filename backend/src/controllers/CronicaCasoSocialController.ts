// controllers/CronicaCasoSocialController.ts
// Single Responsibility: Handle HTTP requests for CronicaCasoSocial

import { Request, Response, NextFunction } from 'express'
import { cronicaCasoSocialService } from '@/services/CronicaCasoSocialService'
import { NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { AuthRequest } from '@/middleware/auth'

export class CronicaCasoSocialController {
  // Obtener todas las crónicas de caso social con paginación
  getAllCronicasCasosSociales = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const search = req.query.search as string | undefined
      const skip = (page - 1) * limit

      let result
      if (search) {
        result = await cronicaCasoSocialService.search(search, { skip, take: limit })
      } else {
        result = await cronicaCasoSocialService.getAllWithFilters({
          skip,
          take: limit,
        })
      }

      const totalPages = Math.ceil(result.total / limit)

      res.json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error in getAllCronicasCasosSociales:', error)
      next(error)
    }
  }

  // Obtener una crónica de caso social por ID
  getCronicaCasoSocialById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const cronica = await cronicaCasoSocialService.getById(id)

      res.json({
        success: true,
        data: { cronica_caso_social: cronica },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: error.message,
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        })
        return
      }
      logger.error('Error in getCronicaCasoSocialById:', error)
      next(error)
    }
  }

  // Crear una nueva crónica de caso social
  createCronicaCasoSocial = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = {
        ...req.body,
        created_by: req.user?.id,
      }

      const cronica = await cronicaCasoSocialService.create(data)

      res.status(201).json({
        success: true,
        data: { cronica_caso_social: cronica },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error in createCronicaCasoSocial:', error)
      next(error)
    }
  }

  // Actualizar una crónica de caso social
  updateCronicaCasoSocial = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const data = {
        ...req.body,
        updated_by: req.user?.id,
      }

      const cronica = await cronicaCasoSocialService.update(id, data)

      res.json({
        success: true,
        data: { cronica_caso_social: cronica },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: error.message,
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        })
        return
      }
      logger.error('Error in updateCronicaCasoSocial:', error)
      next(error)
    }
  }

  // Eliminar una crónica de caso social
  deleteCronicaCasoSocial = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      await cronicaCasoSocialService.delete(id)

      res.json({
        success: true,
        message: 'Crónica de caso social deleted successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: error.message,
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        })
        return
      }
      logger.error('Error in deleteCronicaCasoSocial:', error)
      next(error)
    }
  }
}
