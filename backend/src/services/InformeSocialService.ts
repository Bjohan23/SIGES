import { BaseService } from './BaseService';
import { PrismaClient, InformeSocial } from '@prisma/client';
import { ValidationError, NotFoundError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { IPaginationQuery, IPaginatedResponse } from '@/interfaces/IService';

const prisma = new PrismaClient();

export interface CreateInformeSocialData {
  estudiante_id?: string;
  nombres_apellidos?: string;
  edad?: number;
  estado_civil?: string;
  grado_instruccion?: string;
  direccion?: string;
  motivo?: string;
  situacion_familiar?: string;
  situacion_economica?: string;
  vivienda?: string;
  educacion?: string;
  problema_social?: string;
  apreciacion_profesional?: string;
  lugar?: string;
  fecha?: Date;
  created_by?: string;
}

export interface UpdateInformeSocialData {
  estudiante_id?: string;
  nombres_apellidos?: string;
  edad?: number;
  estado_civil?: string;
  grado_instruccion?: string;
  direccion?: string;
  motivo?: string;
  situacion_familiar?: string;
  situacion_economica?: string;
  vivienda?: string;
  educacion?: string;
  problema_social?: string;
  apreciacion_profesional?: string;
  lugar?: string;
  fecha?: Date;
  updated_by?: string;
}

export class InformeSocialService extends BaseService<InformeSocial, string> {
  constructor() {
    super(prisma.informeSocial);
  }

  protected getEntityName(): string {
    return 'InformeSocial';
  }

  async create(data: CreateInformeSocialData): Promise<InformeSocial> {
    try {
      logger.info('Creating InformeSocial', { estudiante_id: data.estudiante_id });
      const result = await prisma.informeSocial.create({
        data,
      });
      return result;
    } catch (error) {
      logger.error('Failed to create InformeSocial:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateInformeSocialData): Promise<InformeSocial> {
    try {
      const existing = await prisma.informeSocial.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('InformeSocial');
      }

      logger.info('Updating InformeSocial', { id });
      const result = await prisma.informeSocial.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to update InformeSocial:', error);
      throw error;
    }
  }

  async findAll(query: IPaginationQuery & {
    estudiante_id?: string;
    search?: string;
  } = {}): Promise<IPaginatedResponse<InformeSocial>> {
    try {
      const {
        page = 1,
        limit = 20,
        estudiante_id,
        search,
      } = query;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (estudiante_id) {
        where.estudiante_id = estudiante_id;
      }

      if (search) {
        where.OR = [
          { nombres_apellidos: { contains: search, mode: 'insensitive' } },
          { motivo: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.informeSocial.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          include: {
            estudiante: {
              select: {
                id: true,
                codigo: true,
                nombres: true,
                apellido_paterno: true,
                apellido_materno: true,
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
        }),
        prisma.informeSocial.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to find all InformeSocial:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<InformeSocial> {
    try {
      const result = await prisma.informeSocial.findUnique({
        where: { id },
        include: {
          estudiante: {
            select: {
              id: true,
              codigo: true,
              nombres: true,
              apellido_paterno: true,
              apellido_materno: true,
              fecha_nacimiento: true,
              dni: true,
            },
          },
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
            },
          },
          actualizador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      });

      if (!result) {
        throw new NotFoundError('InformeSocial');
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to find InformeSocial by id:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existing = await prisma.informeSocial.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('InformeSocial');
      }

      await prisma.informeSocial.delete({
        where: { id },
      });

      logger.info('InformeSocial deleted', { id });
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to delete InformeSocial:', error);
      throw error;
    }
  }
}
