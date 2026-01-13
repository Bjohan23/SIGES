// services/SituacionSocioFamiliarService.ts
// Single Responsibility: Operaciones CRUD de Situaciones Socio Familiares

import { PrismaClient, SituacionSocioFamiliar } from '@prisma/client'
import { NotFoundError } from '@/utils/errors'
import { BaseService, ServiceOptions } from './BaseService'
import { logger } from '@/utils/logger'

const prisma = new PrismaClient()

export interface CreateSituacionSocioFamiliarData {
  estudiante_id?: string
  subsistema_conyugal?: string
  subsistema_paterno_fiscal?: string
  subsistema_fraternal?: string
  solidaridad_familiar?: string
  relaciones?: string
  desempeno_roles?: string
  relaciones_crianza?: string
  relaciones_exogrupo?: string
  pautas_vida_familiar?: string
  created_by?: string
}

export interface UpdateSituacionSocioFamiliarData {
  estudiante_id?: string
  subsistema_conyugal?: string
  subsistema_paterno_fiscal?: string
  subsistema_fraternal?: string
  solidaridad_familiar?: string
  relaciones?: string
  desempeno_roles?: string
  relaciones_crianza?: string
  relaciones_exogrupo?: string
  pautas_vida_familiar?: string
  updated_by?: string
}

export interface SituacionSocioFamiliarFilters {
  page?: number
  limit?: number
  search?: string
}

export class SituacionSocioFamiliarService extends BaseService<any, string> {
  constructor() {
    super()
    this.model = prisma.situacionSocioFamiliar
  }

  // Obtener todas las situaciones socio familiares con paginación y filtros
  async getAllWithFilters(options: ServiceOptions<any> = {}) {
    try {
      const { where = {}, orderBy = {}, ...pagination } = options

      const [data, total] = await Promise.all([
        prisma.situacionSocioFamiliar.findMany({
          where,
          orderBy: orderBy || { created_at: 'desc' },
          include: {
            estudiante: {
              select: {
                id: true,
                codigo: true,
                apellido_paterno: true,
                apellido_materno: true,
                nombres: true,
              },
            },
            creador: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
              },
            },
          },
          ...pagination,
        }),
        prisma.situacionSocioFamiliar.count({ where }),
      ])

      return { data, total }
    } catch (error) {
      logger.error('Failed to fetch SituacionSocioFamiliar records:', error)
      throw error
    }
  }

  // Buscar situaciones socio familiares
  async search(term: string, pagination?: { skip?: number; take?: number }) {
    try {
      const where = {
        OR: [
          { subsistema_conyugal: { contains: term, mode: 'insensitive' as const } },
          { relaciones: { contains: term, mode: 'insensitive' as const } },
          { desempeno_roles: { contains: term, mode: 'insensitive' as const } },
        ],
      }

      return this.getAllWithFilters({
        where,
        ...pagination,
      })
    } catch (error) {
      logger.error('Failed to search SituacionSocioFamiliar:', error)
      throw error
    }
  }

  // Crear una nueva situación socio familiar
  override async create(data: CreateSituacionSocioFamiliarData): Promise<any> {
    try {
      logger.info('Creating SituacionSocioFamiliar')
      const result = await prisma.situacionSocioFamiliar.create({
        data,
        include: {
          estudiante: {
            select: {
              id: true,
              codigo: true,
              apellido_paterno: true,
              apellido_materno: true,
              nombres: true,
            },
          },
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      })
      return result
    } catch (error) {
      logger.error('Failed to create SituacionSocioFamiliar:', error)
      throw error
    }
  }

  // Obtener una situación socio familiar por ID
  override async getById(id: string): Promise<any> {
    try {
      const situacion = await prisma.situacionSocioFamiliar.findUnique({
        where: { id },
        include: {
          estudiante: {
            select: {
              id: true,
              codigo: true,
              apellido_paterno: true,
              apellido_materno: true,
              nombres: true,
            },
          },
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      })

      if (!situacion) {
        throw new NotFoundError('Situación socio familiar not found')
      }

      return situacion
    } catch (error) {
      logger.error('Failed to fetch SituacionSocioFamiliar by ID:', error)
      throw error
    }
  }

  // Actualizar una situación socio familiar
  override async update(id: string, data: UpdateSituacionSocioFamiliarData): Promise<any> {
    try {
      logger.info('Updating SituacionSocioFamiliar', { id })

      const situacion = await prisma.situacionSocioFamiliar.update({
        where: { id },
        data,
        include: {
          estudiante: {
            select: {
              id: true,
              codigo: true,
              apellido_paterno: true,
              apellido_materno: true,
              nombres: true,
            },
          },
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      })

      return situacion
    } catch (error) {
      logger.error('Failed to update SituacionSocioFamiliar:', error)
      throw error
    }
  }

  // Eliminar una situación socio familiar
  override async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting SituacionSocioFamiliar', { id })
      await prisma.situacionSocioFamiliar.delete({
        where: { id },
      })
    } catch (error) {
      logger.error('Failed to delete SituacionSocioFamiliar:', error)
      throw error
    }
  }
}

// Export singleton instance
export const situacionSocioFamiliarService = new SituacionSocioFamiliarService()
