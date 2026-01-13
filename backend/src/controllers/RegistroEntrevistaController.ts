// controllers/RegistroEntrevistaController.ts
// Single Responsibility: Manejo de solicitudes HTTP para RegistroEntrevista

import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import { RegistroEntrevistaService, CreateRegistroEntrevistaData, UpdateRegistroEntrevistaData } from '@/services/RegistroEntrevistaService'

export class RegistroEntrevistaController extends BaseController {
  private registroEntrevistaService: RegistroEntrevistaService

  constructor() {
    super()
    this.registroEntrevistaService = new RegistroEntrevistaService()
  }

  /**
   * Get all registros de entrevista (with pagination and filtering)
   * GET /api/v1/registros-entrevistas
   */
  getAllRegistrosEntrevistas = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ALL_REGISTROS_ENTREVISTAS')

    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const search = req.query.search as string

    const result = await this.registroEntrevistaService.findAll({
      page,
      limit,
      search,
    })

    this.paginated(res, result.data, {
      page,
      limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
      hasNext: result.pagination.hasNext,
      hasPrev: result.pagination.hasPrev,
    })
  })

  /**
   * Get registro de entrevista by ID
   * GET /api/v1/registros-entrevistas/:id
   */
  getRegistroEntrevistaById = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_REGISTRO_ENTREVISTA_BY_ID')

    const { id } = req.params
    const registro = await this.registroEntrevistaService.findById(id)

    if (!registro) {
      return this.notFound(res, 'Registro de Entrevista no encontrado')
    }

    this.success(res, { registro_entrevista: registro })
  })

  /**
   * Create new registro de entrevista
   * POST /api/v1/registros-entrevistas
   */
  createRegistroEntrevista = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'CREATE_REGISTRO_ENTREVISTA')

    const userId = this.getUserIdFromRequest(req) || undefined

    const data: CreateRegistroEntrevistaData = {
      lugar: req.body.lugar,
      fecha: req.body.fecha ? new Date(req.body.fecha) : undefined,
      hora: req.body.hora,
      tema: req.body.tema,
      objetivo: req.body.objetivo,
      entrevistado: req.body.entrevistado,
      entrevistador: req.body.entrevistador,
      descripcion_relato: req.body.descripcion_relato,
      created_by: userId,
    }

    const registro = await this.registroEntrevistaService.create(data)

    this.created(res, { registro_entrevista: registro })
  })

  /**
   * Update registro de entrevista
   * PUT /api/v1/registros-entrevistas/:id
   */
  updateRegistroEntrevista = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'UPDATE_REGISTRO_ENTREVISTA')

    const { id } = req.params
    const userId = this.getUserIdFromRequest(req) || undefined

    const data: UpdateRegistroEntrevistaData = {
      lugar: req.body.lugar,
      fecha: req.body.fecha ? new Date(req.body.fecha) : undefined,
      hora: req.body.hora,
      tema: req.body.tema,
      objetivo: req.body.objetivo,
      entrevistado: req.body.entrevistado,
      entrevistador: req.body.entrevistador,
      descripcion_relato: req.body.descripcion_relato,
      updated_by: userId,
    }

    const registro = await this.registroEntrevistaService.update(id, data)

    if (!registro) {
      return this.notFound(res, 'Registro de Entrevista no encontrado')
    }

    this.success(res, { registro_entrevista: registro })
  })

  /**
   * Delete registro de entrevista
   * DELETE /api/v1/registros-entrevistas/:id
   */
  deleteRegistroEntrevista = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'DELETE_REGISTRO_ENTREVISTA')

    const { id } = req.params
    await this.registroEntrevistaService.delete(id)

    this.success(res, { message: 'Registro de Entrevista eliminado exitosamente' })
  })
}
