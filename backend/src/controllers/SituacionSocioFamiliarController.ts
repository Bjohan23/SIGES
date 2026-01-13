// controllers/SituacionSocioFamiliarController.ts
// Single Responsibility: Handle HTTP requests for SituacionSocioFamiliar

import { Request, Response, NextFunction } from 'express'
import { situacionSocioFamiliarService } from '@/services/SituacionSocioFamiliarService'
import { NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { AuthRequest } from '@/middleware/auth'

export class SituacionSocioFamiliarController {
  // Obtener todas las situaciones socio familiares con paginación
  getAllSituacionesSocioFamiliares = async (
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
        result = await situacionSocioFamiliarService.search(search, { skip, take: limit })
      } else {
        result = await situacionSocioFamiliarService.getAllWithFilters({
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
      logger.error('Error in getAllSituacionesSocioFamiliares:', error)
      next(error)
    }
  }

  // Obtener una situación socio familiar por ID
  getSituacionSocioFamiliarById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const situacion = await situacionSocioFamiliarService.getById(id)

      res.json({
        success: true,
        data: { situacion_socio_familiar: situacion },
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
      logger.error('Error in getSituacionSocioFamiliarById:', error)
      next(error)
    }
  }

  // Crear una nueva situación socio familiar
  createSituacionSocioFamiliar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = {
        ...req.body,
        created_by: req.user?.id,
      }

      const situacion = await situacionSocioFamiliarService.create(data)

      res.status(201).json({
        success: true,
        data: { situacion_socio_familiar: situacion },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error in createSituacionSocioFamiliar:', error)
      next(error)
    }
  }

  // Actualizar una situación socio familiar
  updateSituacionSocioFamiliar = async (
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

      const situacion = await situacionSocioFamiliarService.update(id, data)

      res.json({
        success: true,
        data: { situacion_socio_familiar: situacion },
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
      logger.error('Error in updateSituacionSocioFamiliar:', error)
      next(error)
    }
  }

  // Eliminar una situación socio familiar
  deleteSituacionSocioFamiliar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      await situacionSocioFamiliarService.delete(id)

      res.json({
        success: true,
        message: 'Situación socio familiar deleted successfully',
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
      logger.error('Error in deleteSituacionSocioFamiliar:', error)
      next(error)
    }
  }
}
