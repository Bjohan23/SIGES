import { BaseService } from './BaseService';
import { PrismaClient, RegistroEntrevista } from '@prisma/client';
import { ValidationError, NotFoundError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { IPaginationQuery, IPaginatedResponse } from '@/interfaces/IService';

const prisma = new PrismaClient();

export interface CreateRegistroEntrevistaData {
  estudiante_id?: string;
  lugar?: string;
  fecha?: Date;
  hora?: string;
  tema?: string;
  objetivo?: string;
  entrevistado?: string;
  entrevistador?: string;
  descripcion_relato?: string;
  created_by?: string;
}

export interface UpdateRegistroEntrevistaData {
  estudiante_id?: string;
  lugar?: string;
  fecha?: Date;
  hora?: string;
  tema?: string;
  objetivo?: string;
  entrevistado?: string;
  entrevistador?: string;
  descripcion_relato?: string;
  updated_by?: string;
}

export class RegistroEntrevistaService extends BaseService<RegistroEntrevista, string> {
  constructor() {
    super(prisma.registroEntrevista);
  }

  protected getEntityName(): string {
    return 'RegistroEntrevista';
  }

  async create(data: CreateRegistroEntrevistaData): Promise<RegistroEntrevista> {
    try {
      logger.info('Creating RegistroEntrevista', { estudiante_id: data.estudiante_id });
      const result = await prisma.registroEntrevista.create({
        data,
      });
      return result;
    } catch (error) {
      logger.error('Failed to create RegistroEntrevista:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateRegistroEntrevistaData): Promise<RegistroEntrevista> {
    try {
      const existing = await prisma.registroEntrevista.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('RegistroEntrevista');
      }

      logger.info('Updating RegistroEntrevista', { id });
      const result = await prisma.registroEntrevista.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to update RegistroEntrevista:', error);
      throw error;
    }
  }

  async findAll(query: IPaginationQuery & {
    estudiante_id?: string;
    search?: string;
  } = {}): Promise<IPaginatedResponse<RegistroEntrevista>> {
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
          { tema: { contains: search, mode: 'insensitive' } },
          { entrevistado: { contains: search, mode: 'insensitive' } },
          { objetivo: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.registroEntrevista.findMany({
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
        prisma.registroEntrevista.count({ where }),
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
      logger.error('Failed to find all RegistroEntrevista:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<RegistroEntrevista> {
    try {
      const result = await prisma.registroEntrevista.findUnique({
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
        throw new NotFoundError('RegistroEntrevista');
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to find RegistroEntrevista by id:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existing = await prisma.registroEntrevista.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('RegistroEntrevista');
      }

      await prisma.registroEntrevista.delete({
        where: { id },
      });

      logger.info('RegistroEntrevista deleted', { id });
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to delete RegistroEntrevista:', error);
      throw error;
    }
  }
}
