import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { FichaSocial } from '@prisma/client';
import { prisma } from '@/config/database';

export class FichaSocialRepository extends BaseRepository<FichaSocial> {
  constructor() {
    super(prisma, 'fichaSocial');
  }

  async findByDni(dni: string): Promise<FichaSocial | null> {
    try {
      const result = await this.getModel().findUnique({ where: { dni } });
      return result;
    } catch (error) {
      logger.error('Failed to find ficha social by DNI:', error);
      throw new DatabaseError('Failed to find ficha social by DNI');
    }
  }

  async searchByNombreOrApellido(query: string): Promise<FichaSocial[]> {
    try {
      const result = await this.getModel().findMany({
        where: {
          OR: [
            { nombres: { contains: query, mode: 'insensitive' } },
            { apellidos: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { created_at: 'desc' },
        take: 50,
      });
      return result;
    } catch (error) {
      logger.error('Failed to search fichas sociales by name:', error);
      throw new DatabaseError('Failed to search fichas sociales by name');
    }
  }

  async findByEstado(estado: string): Promise<FichaSocial[]> {
    try {
      const result = await this.getModel().findMany({
        where: { estado },
        include: {
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
        },
        orderBy: { updated_at: 'desc' },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find fichas sociales by estado:', error);
      throw new DatabaseError('Failed to find fichas sociales by estado');
    }
  }

  async findByDistrito(distrito: string): Promise<FichaSocial[]> {
    try {
      const result = await this.getModel().findMany({
        where: { distrito: { contains: distrito, mode: 'insensitive' } },
        orderBy: { created_at: 'desc' },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find fichas sociales by distrito:', error);
      throw new DatabaseError('Failed to find fichas sociales by distrito');
    }
  }

  async findWithDetails(id: string): Promise<FichaSocial | null> {
    try {
      const result = await this.getModel().findUnique({
        where: { id },
        include: {
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          actualizador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          entrevistas: {
            select: {
              id: true,
              estudiante_nombres: true,
              estudiante_apellidos: true,
              grado: true,
              aula: true,
              estado: true,
              created_at: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find ficha social with details:', error);
      throw new DatabaseError('Failed to find ficha social with details');
    }
  }

  async advancedSearch(filters: {
    nombres?: string;
    apellidos?: string;
    dni?: string;
    distrito?: string;
    estado?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: FichaSocial[]; total: number }> {
    try {
      const {
        nombres,
        apellidos,
        dni,
        distrito,
        estado,
        fechaDesde,
        fechaHasta,
        page = 1,
        limit = 20,
      } = filters;

      const where: any = {};

      if (nombres) {
        where.nombres = { contains: nombres, mode: 'insensitive' };
      }
      if (apellidos) {
        where.apellidos = { contains: apellidos, mode: 'insensitive' };
      }
      if (dni) {
        where.dni = { contains: dni, mode: 'insensitive' };
      }
      if (distrito) {
        where.distrito = { contains: distrito, mode: 'insensitive' };
      }
      if (estado) {
        where.estado = estado;
      }
      if (fechaDesde || fechaHasta) {
        where.created_at = {};
        if (fechaDesde) {
          where.created_at.gte = fechaDesde;
        }
        if (fechaHasta) {
          where.created_at.lte = fechaHasta;
        }
      }

      const [data, total] = await Promise.all([
        this.getModel().findMany({
          where,
          include: {
            creador: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.getModel().count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      logger.error('Failed to perform advanced search on fichas sociales:', error);
      throw new DatabaseError('Failed to perform advanced search on fichas sociales');
    }
  }

  async updateProgress(id: string, porcentaje: number): Promise<FichaSocial | null> {
    try {
      const result = await this.getModel().update({
        where: { id },
        data: {
          porcentaje_completado: porcentaje,
          estado: porcentaje === 100 ? 'COMPLETA' : 'INCOMPLETA',
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to update ficha social progress:', error);
      throw new DatabaseError('Failed to update ficha social progress');
    }
  }

  async changeEstado(id: string, estado: string, userId: string): Promise<FichaSocial | null> {
    try {
      const result = await this.getModel().update({
        where: { id },
        data: {
          estado,
          updated_by: userId,
          updated_at: new Date(),
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to change ficha social estado:', error);
      throw new DatabaseError('Failed to change ficha social estado');
    }
  }

  async getStatistics(): Promise<{
    total: number;
    incompletas: number;
    completas: number;
    enRevision: number;
    aprobadas: number;
    rechazadas: number;
    porcentajeCompletadoPromedio: number;
  }> {
    try {
      const [
        total,
        incompletas,
        completas,
        enRevision,
        aprobadas,
        rechazadas,
        avgResult,
      ] = await Promise.all([
        this.getModel().count(),
        this.getModel().count({ where: { estado: 'INCOMPLETA' } }),
        this.getModel().count({ where: { estado: 'COMPLETA' } }),
        this.getModel().count({ where: { estado: 'EN_REVISION' } }),
        this.getModel().count({ where: { estado: 'APROBADA' } }),
        this.getModel().count({ where: { estado: 'RECHAZADA' } }),
        this.getModel().aggregate({
          _avg: {
            porcentaje_completado: true,
          },
        }),
      ]);

      return {
        total,
        incompletas,
        completas,
        enRevision,
        aprobadas,
        rechazadas,
        porcentajeCompletadoPromedio: Math.round(avgResult._avg.porcentaje_completado || 0),
      };
    } catch (error) {
      logger.error('Failed to get fichas sociales statistics:', error);
      throw new DatabaseError('Failed to get fichas sociales statistics');
    }
  }
}