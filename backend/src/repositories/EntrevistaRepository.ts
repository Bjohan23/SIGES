import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { EntrevistaAplicada } from '@prisma/client';
import { prisma } from '@/config/database';

export class EntrevistaRepository extends BaseRepository<EntrevistaAplicada> {
  constructor() {
    super(prisma, 'entrevistaAplicada');
  }

  async findByFichaSocialId(fichaSocialId: string): Promise<EntrevistaAplicada[]> {
    try {
      const result = await this.getModel().findMany({
        where: { ficha_social_id: fichaSocialId },
        orderBy: { created_at: 'desc' },
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
      });
      return result;
    } catch (error) {
      logger.error('Failed to find entrevistas by ficha social id:', error);
      throw new DatabaseError('Failed to find entrevistas by ficha social id');
    }
  }

  async findByEstudiante(query: string): Promise<EntrevistaAplicada[]> {
    try {
      const result = await this.getModel().findMany({
        where: {
          OR: [
            { estudiante_nombres: { contains: query, mode: 'insensitive' } },
            { estudiante_apellidos: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { created_at: 'desc' },
        include: {
          ficha_social: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              dni: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find entrevistas by estudiante:', error);
      throw new DatabaseError('Failed to find entrevistas by estudiante');
    }
  }

  async findByGrado(grado: string): Promise<EntrevistaAplicada[]> {
    try {
      const result = await this.getModel().findMany({
        where: { grado },
        orderBy: { created_at: 'desc' },
        include: {
          ficha_social: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              dni: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find entrevistas by grado:', error);
      throw new DatabaseError('Failed to find entrevistas by grado');
    }
  }

  async findByEstado(estado: string): Promise<EntrevistaAplicada[]> {
    try {
      const result = await this.getModel().findMany({
        where: { estado },
        orderBy: { created_at: 'desc' },
        include: {
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          ficha_social: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              dni: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find entrevistas by estado:', error);
      throw new DatabaseError('Failed to find entrevistas by estado');
    }
  }

  async findWithDetails(id: string): Promise<EntrevistaAplicada | null> {
    try {
      const result = await this.getModel().findUnique({
        where: { id },
        include: {
          ficha_social: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              dni: true,
              domicilio_actual: true,
              distrito: true,
            },
          },
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
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find entrevista with details:', error);
      throw new DatabaseError('Failed to find entrevista with details');
    }
  }

  async advancedSearch(filters: {
    estudianteNombres?: string;
    estudianteApellidos?: string;
    grado?: string;
    aula?: string;
    estado?: string;
    fichaSocialId?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: EntrevistaAplicada[]; total: number }> {
    try {
      const {
        estudianteNombres,
        estudianteApellidos,
        grado,
        aula,
        estado,
        fichaSocialId,
        fechaDesde,
        fechaHasta,
        page = 1,
        limit = 20,
      } = filters;

      const where: any = {};

      if (estudianteNombres) {
        where.estudiante_nombres = { contains: estudianteNombres, mode: 'insensitive' };
      }
      if (estudianteApellidos) {
        where.estudiante_apellidos = { contains: estudianteApellidos, mode: 'insensitive' };
      }
      if (grado) {
        where.grado = { contains: grado, mode: 'insensitive' };
      }
      if (aula) {
        where.aula = { contains: aula, mode: 'insensitive' };
      }
      if (estado) {
        where.estado = estado;
      }
      if (fichaSocialId) {
        where.ficha_social_id = fichaSocialId;
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
            ficha_social: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                dni: true,
              },
            },
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
      logger.error('Failed to perform advanced search on entrevistas:', error);
      throw new DatabaseError('Failed to perform advanced search on entrevistas');
    }
  }

  async updateProgress(id: string, porcentaje: number): Promise<EntrevistaAplicada | null> {
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
      logger.error('Failed to update entrevista progress:', error);
      throw new DatabaseError('Failed to update entrevista progress');
    }
  }

  async changeEstado(id: string, estado: string, userId: string): Promise<EntrevistaAplicada | null> {
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
      logger.error('Failed to change entrevista estado:', error);
      throw new DatabaseError('Failed to change entrevista estado');
    }
  }

  async getStatistics(): Promise<{
    total: number;
    incompletas: number;
    completas: number;
    enRevision: number;
    aprobadas: number;
    rechazadas: number;
    porGrado: Record<string, number>;
  }> {
    try {
      const [
        total,
        incompletas,
        completas,
        enRevision,
        aprobadas,
        rechazadas,
      ] = await Promise.all([
        this.getModel().count(),
        this.getModel().count({ where: { estado: 'INCOMPLETA' } }),
        this.getModel().count({ where: { estado: 'COMPLETA' } }),
        this.getModel().count({ where: { estado: 'EN_REVISION' } }),
        this.getModel().count({ where: { estado: 'APROBADA' } }),
        this.getModel().count({ where: { estado: 'RECHAZADA' } }),
      ]);

      // Get count by grade
      const porGradoRaw = await this.getModel().groupBy({
        by: ['grado'],
        _count: {
          grado: true,
        },
      });

      const porGrado: Record<string, number> = {};
      porGradoRaw.forEach(item => {
        if (item.grado) {
          porGrado[item.grado] = item._count.grado;
        }
      });

      return {
        total,
        incompletas,
        completas,
        enRevision,
        aprobadas,
        rechazadas,
        porGrado,
      };
    } catch (error) {
      logger.error('Failed to get entrevistas statistics:', error);
      throw new DatabaseError('Failed to get entrevistas statistics');
    }
  }
}