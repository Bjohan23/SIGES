// services/EntrevistaService.ts
// Single Responsibility: Lógica de negocio para EntrevistaAplicada

import { BaseService } from './BaseService'
import { EntrevistaRepository } from '@/repositories/EntrevistaRepository'
import { AppError, NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { EntrevistaAplicada, EstadoFicha } from '@prisma/client'

export interface CreateEntrevistaData {
  ficha_social_id?: string
  estudiante_id?: string
  estudiante_nombres: string
  estudiante_apellidos: string
  estudiante_edad?: number
  estudiante_fecha_nacimiento?: Date
  aula?: string
  grado?: string
  respuestas?: any
  estado?: EstadoFicha
  porcentaje_completado?: number
}

export interface UpdateEntrevistaData extends Partial<CreateEntrevistaData> {}

export class EntrevistaService extends BaseService<EntrevistaAplicada, string> {
  constructor(private entrevistaRepository: EntrevistaRepository) {
    super(entrevistaRepository)
  }

  protected getEntityName(): string {
    return 'Entrevista'
  }

  // Crear nueva entrevista
  async create(data: CreateEntrevistaData, userId?: string): Promise<EntrevistaAplicada> {
    try {
      // Validar datos requeridos
      await this.validateCreate(data)

      const createData: any = {
        ...data,
        created_by: userId,
      }

      const entrevista = await this.entrevistaRepository.create(createData)

      logger.info('Entrevista creada exitosamente', { entrevistaId: entrevista.id })
      return entrevista
    } catch (error) {
      logger.error('Error al crear entrevista:', error)
      throw error
    }
  }

  // Actualizar entrevista
  async update(id: string, data: UpdateEntrevistaData, userId?: string): Promise<EntrevistaAplicada> {
    try {
      await this.validateUpdate(id, data)

      const updateData: any = {
        ...data,
        updated_by: userId,
      }

      const entrevista = await this.entrevistaRepository.update(id, updateData)

      if (!entrevista) {
        throw new NotFoundError('Entrevista')
      }

      logger.info('Entrevista actualizada exitosamente', { entrevistaId: id })
      return entrevista
    } catch (error) {
      logger.error('Error al actualizar entrevista:', error)
      throw error
    }
  }

  // Buscar entrevistas por estudiante
  async findByEstudiante(query: string): Promise<EntrevistaAplicada[]> {
    try {
      return await this.entrevistaRepository.findByEstudiante(query)
    } catch (error) {
      logger.error('Error al buscar entrevistas por estudiante:', error)
      throw error
    }
  }

  // Buscar entrevistas por grado
  async findByGrado(grado: string): Promise<EntrevistaAplicada[]> {
    try {
      return await this.entrevistaRepository.findByGrado(grado)
    } catch (error) {
      logger.error('Error al buscar entrevistas por grado:', error)
      throw error
    }
  }

  // Búsqueda avanzada
  async advancedSearch(filters: {
    estudianteNombres?: string
    estudianteApellidos?: string
    grado?: string
    aula?: string
    estado?: string
    page?: number
    limit?: number
  }) {
    try {
      return await this.entrevistaRepository.advancedSearch(filters)
    } catch (error) {
      logger.error('Error en búsqueda avanzada de entrevistas:', error)
      throw error
    }
  }

  // Obtener entrevista con detalles
  async findWithDetails(id: string): Promise<EntrevistaAplicada | null> {
    try {
      return await this.entrevistaRepository.findWithDetails(id)
    } catch (error) {
      logger.error('Error al obtener entrevista con detalles:', error)
      throw error
    }
  }

  // Actualizar progreso de entrevista
  async updateProgress(id: string, porcentaje: number): Promise<EntrevistaAplicada | null> {
    try {
      if (porcentaje < 0 || porcentaje > 100) {
        throw new AppError('El porcentaje debe estar entre 0 y 100', 400)
      }

      return await this.entrevistaRepository.updateProgress(id, porcentaje)
    } catch (error) {
      logger.error('Error al actualizar progreso de entrevista:', error)
      throw error
    }
  }

  // Cambiar estado de entrevista
  async changeEstado(id: string, estado: EstadoFicha, userId: string): Promise<EntrevistaAplicada | null> {
    try {
      return await this.entrevistaRepository.changeEstado(id, estado, userId)
    } catch (error) {
      logger.error('Error al cambiar estado de entrevista:', error)
      throw error
    }
  }

  // Obtener estadísticas
  async getStatistics() {
    try {
      return await this.entrevistaRepository.getStatistics()
    } catch (error) {
      logger.error('Error al obtener estadísticas de entrevistas:', error)
      throw error
    }
  }

  // Validaciones
  protected async validateCreate(data: CreateEntrevistaData): Promise<void> {
    if (!data.estudiante_nombres || data.estudiante_nombres.trim() === '') {
      throw new AppError('El nombre del estudiante es obligatorio', 400)
    }

    if (!data.estudiante_apellidos || data.estudiante_apellidos.trim() === '') {
      throw new AppError('Los apellidos del estudiante son obligatorios', 400)
    }
  }

  protected async validateUpdate(id: string, data: UpdateEntrevistaData): Promise<void> {
    if (data.estudiante_nombres !== undefined && data.estudiante_nombres.trim() === '') {
      throw new AppError('El nombre del estudiante no puede estar vacío', 400)
    }

    if (data.estudiante_apellidos !== undefined && data.estudiante_apellidos.trim() === '') {
      throw new AppError('Los apellidos del estudiante no pueden estar vacíos', 400)
    }
  }
}
