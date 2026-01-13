// controllers/InformeSocialController.ts
// Single Responsibility: Manejo de solicitudes HTTP para InformeSocial

import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import { InformeSocialService, CreateInformeSocialData, UpdateInformeSocialData } from '@/services/InformeSocialService'

export class InformeSocialController extends BaseController {
  private informeSocialService: InformeSocialService

  constructor() {
    super()
    this.informeSocialService = new InformeSocialService()
  }

  /**
   * Get all informes sociales (with pagination and filtering)
   * GET /api/v1/informes-sociales
   */
  getAllInformesSociales = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ALL_INFORMES_SOCIALES')

    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const estudiante_id = req.query.estudiante_id as string
    const search = req.query.search as string

    const result = await this.informeSocialService.findAll({
      page,
      limit,
      estudiante_id,
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
   * Get informe social by ID
   * GET /api/v1/informes-sociales/:id
   */
  getInformeSocialById = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_INFORME_SOCIAL_BY_ID')

    const { id } = req.params
    const informe = await this.informeSocialService.findById(id)

    if (!informe) {
      return this.notFound(res, 'Informe Social no encontrado')
    }

    this.success(res, { informe_social: informe })
  })

  /**
   * Create new informe social
   * POST /api/v1/informes-sociales
   */
  createInformeSocial = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'CREATE_INFORME_SOCIAL')

    const userId = this.getUserIdFromRequest(req) || undefined

    const data: CreateInformeSocialData = {
      estudiante_id: req.body.estudiante_id,
      nombres_apellidos: req.body.nombres_apellidos,
      edad: req.body.edad,
      estado_civil: req.body.estado_civil,
      grado_instruccion: req.body.grado_instruccion,
      direccion: req.body.direccion,
      motivo: req.body.motivo,
      situacion_familiar: req.body.situacion_familiar,
      situacion_economica: req.body.situacion_economica,
      vivienda: req.body.vivienda,
      educacion: req.body.educacion,
      problema_social: req.body.problema_social,
      apreciacion_profesional: req.body.apreciacion_profesional,
      lugar: req.body.lugar,
      fecha: req.body.fecha ? new Date(req.body.fecha) : undefined,
      created_by: userId,
    }

    const informe = await this.informeSocialService.create(data)

    this.created(res, { informe_social: informe })
  })

  /**
   * Update informe social
   * PUT /api/v1/informes-sociales/:id
   */
  updateInformeSocial = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'UPDATE_INFORME_SOCIAL')

    const { id } = req.params
    const userId = this.getUserIdFromRequest(req) || undefined

    const data: UpdateInformeSocialData = {
      estudiante_id: req.body.estudiante_id,
      nombres_apellidos: req.body.nombres_apellidos,
      edad: req.body.edad,
      estado_civil: req.body.estado_civil,
      grado_instruccion: req.body.grado_instruccion,
      direccion: req.body.direccion,
      motivo: req.body.motivo,
      situacion_familiar: req.body.situacion_familiar,
      situacion_economica: req.body.situacion_economica,
      vivienda: req.body.vivienda,
      educacion: req.body.educacion,
      problema_social: req.body.problema_social,
      apreciacion_profesional: req.body.apreciacion_profesional,
      lugar: req.body.lugar,
      fecha: req.body.fecha ? new Date(req.body.fecha) : undefined,
      updated_by: userId,
    }

    const informe = await this.informeSocialService.update(id, data)

    if (!informe) {
      return this.notFound(res, 'Informe Social no encontrado')
    }

    this.success(res, { informe_social: informe })
  })

  /**
   * Delete informe social
   * DELETE /api/v1/informes-sociales/:id
   */
  deleteInformeSocial = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'DELETE_INFORME_SOCIAL')

    const { id } = req.params
    await this.informeSocialService.delete(id)

    this.success(res, { message: 'Informe Social eliminado exitosamente' })
  })
}
