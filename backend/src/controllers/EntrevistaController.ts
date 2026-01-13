// controllers/EntrevistaController.ts
// Single Responsibility: Manejo de solicitudes HTTP para EntrevistaAplicada

import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import { EntrevistaService, CreateEntrevistaData, UpdateEntrevistaData } from '@/services/EntrevistaService'

export class EntrevistaController extends BaseController {
  private entrevistaService: EntrevistaService

  constructor() {
    super()
    this.entrevistaService = new EntrevistaService(
      new (require('@/repositories/EntrevistaRepository')).EntrevistaRepository()
    )
  }

  /**
   * Get all entrevistas (with pagination and filtering)
   * GET /api/v1/entrevistas
   */
  getAllEntrevistas = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ALL_ENTREVISTAS')

    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const estudiante_nombres = req.query.estudiante_nombres as string
    const estudiante_apellidos = req.query.estudiante_apellidos as string
    const grado = req.query.grado as string
    const aula = req.query.aula as string
    const estado = req.query.estado as string

    const result = await this.entrevistaService.advancedSearch({
      estudianteNombres: estudiante_nombres,
      estudianteApellidos: estudiante_apellidos,
      grado,
      aula,
      estado,
      page,
      limit,
    })

    this.paginated(res, result.data, {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      hasNext: page < Math.ceil(result.total / limit),
      hasPrev: page > 1,
    })
  })

  /**
   * Get entrevista by ID
   * GET /api/v1/entrevistas/:id
   */
  getEntrevistaById = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ENTREVISTA_BY_ID')

    const { id } = req.params
    const entrevista = await this.entrevistaService.findWithDetails(id)

    if (!entrevista) {
      return this.notFound(res, 'Entrevista no encontrada')
    }

    this.success(res, { entrevista })
  })

  /**
   * Search entrevistas by estudiante name
   * GET /api/v1/entrevistas/search/:query
   */
  searchEntrevistas = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'SEARCH_ENTREVISTAS')

    const { query } = req.params
    const entrevistas = await this.entrevistaService.findByEstudiante(query)

    this.success(res, { entrevistas })
  })

  /**
   * Create new entrevista
   * POST /api/v1/entrevistas
   */
  createEntrevista = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'CREATE_ENTREVISTA')

    const userId = this.getUserIdFromRequest(req) || undefined

    const data: CreateEntrevistaData = {
      ficha_social_id: req.body.ficha_social_id,
      estudiante_id: req.body.estudiante_id,
      estudiante_nombres: req.body.estudiante_nombres,
      estudiante_apellidos: req.body.estudiante_apellidos,
      estudiante_edad: req.body.estudiante_edad,
      estudiante_fecha_nacimiento: req.body.estudiante_fecha_nacimiento
        ? new Date(req.body.estudiante_fecha_nacimiento)
        : undefined,
      aula: req.body.aula,
      grado: req.body.grado,
      respuestas: req.body.respuestas || {},
      estado: req.body.estado,
      porcentaje_completado: req.body.porcentaje_completado,
    }

    const entrevista = await this.entrevistaService.create(data, userId)

    this.created(res, { entrevista })
  })

  /**
   * Update entrevista
   * PUT /api/v1/entrevistas/:id
   */
  updateEntrevista = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'UPDATE_ENTREVISTA')

    const { id } = req.params
    const userId = this.getUserIdFromRequest(req) || undefined

    const data: UpdateEntrevistaData = {
      ficha_social_id: req.body.ficha_social_id,
      estudiante_id: req.body.estudiante_id,
      estudiante_nombres: req.body.estudiante_nombres,
      estudiante_apellidos: req.body.estudiante_apellidos,
      estudiante_edad: req.body.estudiante_edad,
      estudiante_fecha_nacimiento: req.body.estudiante_fecha_nacimiento
        ? new Date(req.body.estudiante_fecha_nacimiento)
        : undefined,
      aula: req.body.aula,
      grado: req.body.grado,
      respuestas: req.body.respuestas,
      estado: req.body.estado,
      porcentaje_completado: req.body.porcentaje_completado,
    }

    const entrevista = await this.entrevistaService.update(id, data, userId)

    this.success(res, { entrevista })
  })

  /**
   * Delete entrevista
   * DELETE /api/v1/entrevistas/:id
   */
  deleteEntrevista = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'DELETE_ENTREVISTA')

    const { id } = req.params
    await this.entrevistaService.delete(id)

    this.success(res, { message: 'Entrevista eliminada correctamente' })
  })

  /**
   * Update entrevista progress
   * PATCH /api/v1/entrevistas/:id/progress
   */
  updateProgress = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'UPDATE_ENTREVISTA_PROGRESS')

    const { id } = req.params
    const { porcentaje } = req.body

    const entrevista = await this.entrevistaService.updateProgress(id, porcentaje)

    if (!entrevista) {
      return this.notFound(res, 'Entrevista no encontrada')
    }

    this.success(res, { entrevista })
  })

  /**
   * Change entrevista estado
   * PATCH /api/v1/entrevistas/:id/estado
   */
  changeEstado = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'CHANGE_ENTREVISTA_ESTADO')

    const { id } = req.params
    const { estado } = req.body
    const userId = this.getUserIdFromRequest(req)

    if (!userId) {
      return this.unauthorized(res, 'Usuario no autenticado')
    }

    const entrevista = await this.entrevistaService.changeEstado(id, estado, userId)

    if (!entrevista) {
      return this.notFound(res, 'Entrevista no encontrada')
    }

    this.success(res, { entrevista })
  })

  /**
   * Get entrevistas statistics
   * GET /api/v1/entrevistas/statistics
   */
  getStatistics = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ENTREVISTAS_STATISTICS')

    const stats = await this.entrevistaService.getStatistics()

    this.success(res, stats)
  })
}
