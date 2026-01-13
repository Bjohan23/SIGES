import { BaseService } from './BaseService';
import { PrismaClient, RegistroVisitaDomiciliaria } from '@prisma/client';
import { NotFoundError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { IPaginationQuery, IPaginatedResponse } from '@/interfaces/IService';

const prisma = new PrismaClient();

export interface CreateRegistroVisitaDomiciliariaData {
  nombre_entrevistado?: string;
  domicilio?: string;
  fecha_visita?: Date;
  responsable?: string;
  objetivo?: string;
  relato?: string;
  created_by?: string;
}

export interface UpdateRegistroVisitaDomiciliariaData {
  nombre_entrevistado?: string;
  domicilio?: string;
  fecha_visita?: Date;
  responsable?: string;
  objetivo?: string;
  relato?: string;
  updated_by?: string;
}

export class RegistroVisitaDomiciliariaService extends BaseService<RegistroVisitaDomiciliaria, string> {
  constructor() {
    super(prisma.registroVisitaDomiciliaria);
  }

  protected getEntityName(): string {
    return 'RegistroVisitaDomiciliaria';
  }

  override async create(data: CreateRegistroVisitaDomiciliariaData): Promise<RegistroVisitaDomiciliaria> {
    try {
      logger.info('Creating RegistroVisitaDomiciliaria', { nombre_entrevistado: data.nombre_entrevistado });
      const result = await prisma.registroVisitaDomiciliaria.create({
        data,
      });
      return result;
    } catch (error) {
      logger.error('Failed to create RegistroVisitaDomiciliaria:', error);
      throw error;
    }
  }

  override async update(id: string, data: UpdateRegistroVisitaDomiciliariaData): Promise<RegistroVisitaDomiciliaria> {
    try {
      const existing = await prisma.registroVisitaDomiciliaria.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('RegistroVisitaDomiciliaria');
      }

      logger.info('Updating RegistroVisitaDomiciliaria', { id });
      const result = await prisma.registroVisitaDomiciliaria.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to update RegistroVisitaDomiciliaria:', error);
      throw error;
    }
  }

  override async findAll(query: IPaginationQuery & {
    search?: string;
  } = {}): Promise<IPaginatedResponse<RegistroVisitaDomiciliaria>> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
      } = query;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { nombre_entrevistado: { contains: search, mode: 'insensitive' } },
          { domicilio: { contains: search, mode: 'insensitive' } },
          { objetivo: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.registroVisitaDomiciliaria.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          include: {
            creador: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
              },
            },
          },
        }),
        prisma.registroVisitaDomiciliaria.count({ where }),
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
      logger.error('Failed to find all RegistroVisitaDomiciliaria:', error);
      throw error;
    }
  }

  override async findById(id: string): Promise<RegistroVisitaDomiciliaria> {
    try {
      const result = await prisma.registroVisitaDomiciliaria.findUnique({
        where: { id },
        include: {
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
        throw new NotFoundError('RegistroVisitaDomiciliaria');
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to find RegistroVisitaDomiciliaria by id:', error);
      throw error;
    }
  }

  override async delete(id: string): Promise<boolean> {
    try {
      const existing = await prisma.registroVisitaDomiciliaria.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('RegistroVisitaDomiciliaria');
      }

      await prisma.registroVisitaDomiciliaria.delete({
        where: { id },
      });

      logger.info('RegistroVisitaDomiciliaria deleted', { id });
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to delete RegistroVisitaDomiciliaria:', error);
      throw error;
    }
  }
}
