import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { Estudiante } from '@prisma/client';
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';
import { DatabaseError } from '@/utils/errors';

export class EstudianteRepository extends BaseRepository<Estudiante> {
  constructor() {
    super(prisma, 'estudiante');
  }

  async findByCodigo(codigo: string): Promise<Estudiante | null> {
    try {
      const result = await this.getModel().findUnique({ where: { codigo } });
      return result;
    } catch (error) {
      logger.error('Failed to find estudiante by codigo:', error);
      throw new DatabaseError('Failed to find estudiante by codigo');
    }
  }

  async findByDni(dni: string): Promise<Estudiante | null> {
    try {
      const result = await this.getModel().findUnique({ where: { dni } });
      return result;
    } catch (error) {
      logger.error('Failed to find estudiante by DNI:', error);
      throw new DatabaseError('Failed to find estudiante by DNI');
    }
  }

  async searchByNombreOrApellido(query: string): Promise<Estudiante[]> {
    try {
      const result = await this.getModel().findMany({
        where: {
          AND: {
            activo: true,
          },
          OR: [
            { nombres: { contains: query, mode: 'insensitive' } },
            { apellido_paterno: { contains: query, mode: 'insensitive' } },
            { apellido_materno: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { apellido_paterno: 'asc' },
        take: 50,
      });
      return result;
    } catch (error) {
      logger.error('Failed to search estudiantes by name:', error);
      throw new DatabaseError('Failed to search estudiantes by name');
    }
  }

  async findWithDetails(id: string): Promise<Estudiante | null> {
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
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find estudiante with details:', error);
      throw new DatabaseError('Failed to find estudiante with details');
    }
  }

  async findAllActivos(options: {
    skip?: number;
    take?: number;
  } = {}): Promise<{ data: Estudiante[]; total: number }> {
    try {
      const { skip = 0, take = 50 } = options;

      const [data, total] = await Promise.all([
        this.getModel().findMany({
          where: { activo: true },
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
          orderBy: [{ apellido_paterno: 'asc' }, { apellido_materno: 'asc' }],
          skip,
          take,
        }),
        this.getModel().count({ where: { activo: true } }),
      ]);

      return { data, total };
    } catch (error) {
      logger.error('Failed to find all active estudiantes:', error);
      throw new DatabaseError('Failed to find all active estudiantes');
    }
  }

  async advancedSearch(filters: {
    codigo?: string;
    nombres?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    dni?: string;
    activo?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Estudiante[]; total: number }> {
    try {
      const {
        codigo,
        nombres,
        apellido_paterno,
        apellido_materno,
        dni,
        activo,
        page = 1,
        limit = 20,
      } = filters;

      const where: any = {};

      if (codigo) {
        where.codigo = { contains: codigo, mode: 'insensitive' };
      }
      if (nombres) {
        where.nombres = { contains: nombres, mode: 'insensitive' };
      }
      if (apellido_paterno) {
        where.apellido_paterno = { contains: apellido_paterno, mode: 'insensitive' };
      }
      if (apellido_materno) {
        where.apellido_materno = { contains: apellido_materno, mode: 'insensitive' };
      }
      if (dni) {
        where.dni = { contains: dni, mode: 'insensitive' };
      }
      if (activo !== undefined) {
        where.activo = activo;
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
          orderBy: [{ apellido_paterno: 'asc' }, { apellido_materno: 'asc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.getModel().count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      logger.error('Failed to perform advanced search on estudiantes:', error);
      throw new DatabaseError('Failed to perform advanced search on estudiantes');
    }
  }

  async softDelete(id: string): Promise<Estudiante | null> {
    try {
      const result = await this.getModel().update({
        where: { id },
        data: { activo: false },
      });
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      logger.error('Failed to soft delete estudiante:', error);
      throw new DatabaseError('Failed to soft delete estudiante');
    }
  }
}
