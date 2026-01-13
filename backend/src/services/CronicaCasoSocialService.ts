// services/CronicaCasoSocialService.ts
// Single Responsibility: Operaciones CRUD de Crónicas de Caso Social

import { PrismaClient, CronicaCasoSocial } from '@prisma/client'
import { NotFoundError } from '@/utils/errors'
import { BaseService, ServiceOptions } from './BaseService'
import { logger } from '@/utils/logger'

const prisma = new PrismaClient()

export interface CreateCronicaCasoSocialData {
  estudiante_id?: string
  num_reunion?: number
  fecha_hora?: Date
  nombres_apellidos?: string
  asistentes?: string
  actividades_realizadas?: string
  programas?: string
  relato?: string
  interpretacion?: string
  sugerencias?: string
  created_by?: string
}

export interface UpdateCronicaCasoSocialData {
  estudiante_id?: string
  num_reunion?: number
  fecha_hora?: Date
  nombres_apellidos?: string
  asistentes?: string
  actividades_realizadas?: string
  programas?: string
  relato?: string
  interpretacion?: string
  sugerencias?: string
  updated_by?: string
}

export interface CronicaCasoSocialFilters {
  page?: number
  limit?: number
  search?: string
}

export class CronicaCasoSocialService extends BaseService<any, string> {
  constructor() {
    super()
    this.model = prisma.cronicaCasoSocial
  }

  // Obtener todas las crónicas de caso social con paginación y filtros
  async getAllWithFilters(options: ServiceOptions<any> = {}) {
    try {
      const { where = {}, orderBy = {}, ...pagination } = options

      const [data, total] = await Promise.all([
        prisma.cronicaCasoSocial.findMany({
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
        prisma.cronicaCasoSocial.count({ where }),
      ])

      return { data, total }
    } catch (error) {
      logger.error('Failed to fetch CronicaCasoSocial records:', error)
      throw error
    }
  }

  // Buscar crónicas de caso social
  async search(term: string, pagination?: { skip?: number; take?: number }) {
    try {
      const where = {
        OR: [
          { nombres_apellidos: { contains: term, mode: 'insensitive' as const } },
          { asistentes: { contains: term, mode: 'insensitive' as const } },
        ],
      }

      return this.getAllWithFilters({
        where,
        ...pagination,
      })
    } catch (error) {
      logger.error('Failed to search CronicaCasoSocial:', error)
      throw error
    }
  }

  // Crear una nueva crónica de caso social
  override async create(data: CreateCronicaCasoSocialData): Promise<any> {
    try {
      logger.info('Creating CronicaCasoSocial', { nombres_apellidos: data.nombres_apellidos })
      const result = await prisma.cronicaCasoSocial.create({
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
      logger.error('Failed to create CronicaCasoSocial:', error)
      throw error
    }
  }

  // Obtener una crónica de caso social por ID
  override async getById(id: string): Promise<any> {
    try {
      const cronica = await prisma.cronicaCasoSocial.findUnique({
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

      if (!cronica) {
        throw new NotFoundError('Crónica de caso social not found')
      }

      return cronica
    } catch (error) {
      logger.error('Failed to fetch CronicaCasoSocial by ID:', error)
      throw error
    }
  }

  // Actualizar una crónica de caso social
  override async update(id: string, data: UpdateCronicaCasoSocialData): Promise<any> {
    try {
      logger.info('Updating CronicaCasoSocial', { id })

      const cronica = await prisma.cronicaCasoSocial.update({
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

      return cronica
    } catch (error) {
      logger.error('Failed to update CronicaCasoSocial:', error)
      throw error
    }
  }

  // Eliminar una crónica de caso social
  override async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting CronicaCasoSocial', { id })
      await prisma.cronicaCasoSocial.delete({
        where: { id },
      })
    } catch (error) {
      logger.error('Failed to delete CronicaCasoSocial:', error)
      throw error
    }
  }
}

// Export singleton instance
export const cronicaCasoSocialService = new CronicaCasoSocialService()
