// controllers/RegistroVisitaDomiciliariaController.ts
// Single Responsibility: Manejo de solicitudes HTTP para RegistroVisitaDomiciliaria

import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import { RegistroVisitaDomiciliariaService, CreateRegistroVisitaDomiciliariaData, UpdateRegistroVisitaDomiciliariaData } from '@/services/RegistroVisitaDomiciliariaService'

export class RegistroVisitaDomiciliariaController extends BaseController {
  private registroVisitaDomiciliariaService: RegistroVisitaDomiciliariaService

  constructor() {
    super()
    this.registroVisitaDomiciliariaService = new RegistroVisitaDomiciliariaService()
  }

  /**
   * Get all registros de visita domiciliaria (with pagination and filtering)
   * GET /api/v1/registros-visitas-domiciliarias
   */
  getAllRegistrosVisitasDomiciliarias = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ALL_REGISTROS_VISITAS_DOMICILIARIAS')

    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const search = req.query.search as string

    const result = await this.registroVisitaDomiciliariaService.findAll({
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
   * Get registro de visita domiciliaria by ID
   * GET /api/v1/registros-visitas-domiciliarias/:id
   */
  getRegistroVisitaDomiciliariaById = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_REGISTRO_VISITA_DOMICILIARIA_BY_ID')

    const { id } = req.params
    const registro = await this.registroVisitaDomiciliariaService.findById(id)

    if (!registro) {
      return this.notFound(res, 'Registro de Visita Domiciliaria no encontrado')
    }

    this.success(res, { registro_visita_domiciliaria: registro })
  })

  /**
   * Create new registro de visita domiciliaria
   * POST /api/v1/registros-visitas-domiciliarias
   */
  createRegistroVisitaDomiciliaria = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'CREATE_REGISTRO_VISITA_DOMICILIARIA')

    const userId = this.getUserIdFromRequest(req) || undefined

    const data: CreateRegistroVisitaDomiciliariaData = {
      nombre_entrevistado: req.body.nombre_entrevistado,
      domicilio: req.body.domicilio,
      fecha_visita: req.body.fecha_visita ? new Date(req.body.fecha_visita) : undefined,
      responsable: req.body.responsable,
      objetivo: req.body.objetivo,
      relato: req.body.relato,
      created_by: userId,
    }

    const registro = await this.registroVisitaDomiciliariaService.create(data)

    this.created(res, { registro_visita_domiciliaria: registro })
  })

  /**
   * Update registro de visita domiciliaria
   * PUT /api/v1/registros-visitas-domiciliarias/:id
   */
  updateRegistroVisitaDomiciliaria = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'UPDATE_REGISTRO_VISITA_DOMICILIARIA')

    const { id } = req.params
    const userId = this.getUserIdFromRequest(req) || undefined

    const data: UpdateRegistroVisitaDomiciliariaData = {
      nombre_entrevistado: req.body.nombre_entrevistado,
      domicilio: req.body.domicilio,
      fecha_visita: req.body.fecha_visita ? new Date(req.body.fecha_visita) : undefined,
      responsable: req.body.responsable,
      objetivo: req.body.objetivo,
      relato: req.body.relato,
      updated_by: userId,
    }

    const registro = await this.registroVisitaDomiciliariaService.update(id, data)

    if (!registro) {
      return this.notFound(res, 'Registro de Visita Domiciliaria no encontrado')
    }

    this.success(res, { registro_visita_domiciliaria: registro })
  })

  /**
   * Delete registro de visita domiciliaria
   * DELETE /api/v1/registros-visitas-domiciliarias/:id
   */
  deleteRegistroVisitaDomiciliaria = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'DELETE_REGISTRO_VISITA_DOMICILIARIA')

    const { id } = req.params
    await this.registroVisitaDomiciliariaService.delete(id)

    this.success(res, { message: 'Registro de Visita Domiciliaria eliminado exitosamente' })
  })
}
