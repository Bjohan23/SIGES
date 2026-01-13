// controllers/InformeVisitaDomiciliariaController.ts
// Single Responsibility: Handle HTTP requests for InformeVisitaDomiciliaria

import { Request, Response, NextFunction } from 'express'
import { informeVisitaDomiciliariaService } from '@/services/InformeVisitaDomiciliariaService'
import { NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { AuthRequest } from '@/middleware/auth'

export class InformeVisitaDomiciliariaController {
  // Obtener todos los informes de visita domiciliaria con paginación
  getAllInformesVisitasDomiciliarias = async (
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
        result = await informeVisitaDomiciliariaService.search(search, { skip, take: limit })
      } else {
        result = await informeVisitaDomiciliariaService.getAllWithFilters({
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
      logger.error('Error in getAllInformesVisitasDomiciliarias:', error)
      next(error)
    }
  }

  // Obtener un informe de visita domiciliaria por ID
  getInformeVisitaDomiciliariaById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const informe = await informeVisitaDomiciliariaService.getById(id)

      res.json({
        success: true,
        data: { informe_visita_domiciliaria: informe },
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
      logger.error('Error in getInformeVisitaDomiciliariaById:', error)
      next(error)
    }
  }

  // Crear un nuevo informe de visita domiciliaria
  createInformeVisitaDomiciliaria = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = {
        ...req.body,
        created_by: req.user?.id,
      }

      const informe = await informeVisitaDomiciliariaService.create(data)

      res.status(201).json({
        success: true,
        data: { informe_visita_domiciliaria: informe },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error in createInformeVisitaDomiciliaria:', error)
      next(error)
    }
  }

  // Actualizar un informe de visita domiciliaria
  updateInformeVisitaDomiciliaria = async (
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

      const informe = await informeVisitaDomiciliariaService.update(id, data)

      res.json({
        success: true,
        data: { informe_visita_domiciliaria: informe },
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
      logger.error('Error in updateInformeVisitaDomiciliaria:', error)
      next(error)
    }
  }

  // Eliminar un informe de visita domiciliaria
  deleteInformeVisitaDomiciliaria = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      await informeVisitaDomiciliariaService.delete(id)

      res.json({
        success: true,
        message: 'Informe de visita domiciliaria deleted successfully',
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
      logger.error('Error in deleteInformeVisitaDomiciliaria:', error)
      next(error)
    }
  }
}
