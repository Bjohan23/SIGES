// services/InformeVisitaDomiciliariaService.ts
// Single Responsibility: Operaciones CRUD de Informes de Visita Domiciliaria

import { PrismaClient, InformeVisitaDomiciliaria } from '@prisma/client'
import { NotFoundError } from '@/utils/errors'
import { BaseService, ServiceOptions } from './BaseService'
import { logger } from '@/utils/logger'

const prisma = new PrismaClient()

export interface CreateInformeVisitaDomiciliariaData {
  estudiante_id?: string
  nombres_apellidos?: string
  direccion?: string
  motivo?: string
  objetivos?: string
  narracion?: string
  conclusiones?: string
  created_by?: string
}

export interface UpdateInformeVisitaDomiciliariaData {
  estudiante_id?: string
  nombres_apellidos?: string
  direccion?: string
  motivo?: string
  objetivos?: string
  narracion?: string
  conclusiones?: string
  updated_by?: string
}

export interface InformeVisitaDomiciliariaFilters {
  page?: number
  limit?: number
  search?: string
}

export class InformeVisitaDomiciliariaService extends BaseService<
  any,
  string
> {
  constructor() {
    super()
    this.model = prisma.informeVisitaDomiciliaria
  }

  // Obtener todos los informes de visita domiciliaria con paginación y filtros
  async getAllWithFilters(options: ServiceOptions<any> = {}) {
    try {
      const { where = {}, orderBy = {}, ...pagination } = options

      const [data, total] = await Promise.all([
        prisma.informeVisitaDomiciliaria.findMany({
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
        prisma.informeVisitaDomiciliaria.count({ where }),
      ])

      return { data, total }
    } catch (error) {
      logger.error('Failed to fetch InformeVisitaDomiciliaria records:', error)
      throw error
    }
  }

  // Buscar informes de visita domiciliaria
  async search(term: string, pagination?: { skip?: number; take?: number }) {
    try {
      const where = {
        OR: [
          { nombres_apellidos: { contains: term, mode: 'insensitive' as const } },
          { direccion: { contains: term, mode: 'insensitive' as const } },
          { motivo: { contains: term, mode: 'insensitive' as const } },
        ],
      }

      return this.getAllWithFilters({
        where,
        ...pagination,
      })
    } catch (error) {
      logger.error('Failed to search InformeVisitaDomiciliaria:', error)
      throw error
    }
  }

  // Crear un nuevo informe de visita domiciliaria
  override async create(data: CreateInformeVisitaDomiciliariaData): Promise<any> {
    try {
      logger.info('Creating InformeVisitaDomiciliaria', { nombres_apellidos: data.nombres_apellidos })
      const result = await prisma.informeVisitaDomiciliaria.create({
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
      logger.error('Failed to create InformeVisitaDomiciliaria:', error)
      throw error
    }
  }

  // Obtener un informe de visita domiciliaria por ID
  override async getById(id: string): Promise<any> {
    try {
      const informe = await prisma.informeVisitaDomiciliaria.findUnique({
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

      if (!informe) {
        throw new NotFoundError('Informe de visita domiciliaria not found')
      }

      return informe
    } catch (error) {
      logger.error('Failed to fetch InformeVisitaDomiciliaria by ID:', error)
      throw error
    }
  }

  // Actualizar un informe de visita domiciliaria
  override async update(id: string, data: UpdateInformeVisitaDomiciliariaData): Promise<any> {
    try {
      logger.info('Updating InformeVisitaDomiciliaria', { id })

      const informe = await prisma.informeVisitaDomiciliaria.update({
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

      return informe
    } catch (error) {
      logger.error('Failed to update InformeVisitaDomiciliaria:', error)
      throw error
    }
  }

  // Eliminar un informe de visita domiciliaria
  override async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting InformeVisitaDomiciliaria', { id })
      await prisma.informeVisitaDomiciliaria.delete({
        where: { id },
      })
    } catch (error) {
      logger.error('Failed to delete InformeVisitaDomiciliaria:', error)
      throw error
    }
  }
}

// Export singleton instance
export const informeVisitaDomiciliariaService = new InformeVisitaDomiciliariaService()
