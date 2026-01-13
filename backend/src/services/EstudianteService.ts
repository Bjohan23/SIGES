import { BaseService } from './BaseService';
import { EstudianteRepository } from '@/repositories/EstudianteRepository';
import { Estudiante } from '@prisma/client';
import { ValidationError, NotFoundError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { IPaginationQuery, IPaginatedResponse } from '@/interfaces/IService';

export interface CreateEstudianteData {
  codigo: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombres: string;
  fecha_nacimiento?: Date;
  dni?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  created_by?: string;
}

export interface UpdateEstudianteData {
  codigo?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombres?: string;
  fecha_nacimiento?: Date;
  dni?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo?: boolean;
  updated_by?: string;
}

export class EstudianteService extends BaseService<Estudiante, string> {
  private estudianteRepository: EstudianteRepository;

  constructor() {
    super(new EstudianteRepository());
    this.estudianteRepository = new EstudianteRepository();
  }

  protected getEntityName(): string {
    return 'Estudiante';
  }

  async create(data: CreateEstudianteData): Promise<Estudiante> {
    try {
      // Validate required fields
      await this.validateCreate(data);

      // Check if codigo already exists
      const existingByCodigo = await this.estudianteRepository.findByCodigo(data.codigo);
      if (existingByCodigo) {
        throw new ValidationError('El código de estudiante ya existe');
      }

      // Check if DNI already exists (if provided)
      if (data.dni) {
        const existingByDni = await this.estudianteRepository.findByDni(data.dni);
        if (existingByDni) {
          throw new ValidationError('El DNI ya está registrado');
        }
      }

      // Validate email format if provided
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new ValidationError('Formato de email inválido');
        }
      }

      logger.info('Creating estudiante', { codigo: data.codigo });
      return await super.create(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Failed to create estudiante:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateEstudianteData): Promise<Estudiante> {
    try {
      // Validate required fields
      await this.validateUpdate(id, data);

      // Check if estudiante exists
      const existing = await this.estudianteRepository.findById(id);
      if (!existing) {
        throw new NotFoundError('Estudiante');
      }

      // Check if codigo already exists (if being updated)
      if (data.codigo && data.codigo !== existing.codigo) {
        const existingByCodigo = await this.estudianteRepository.findByCodigo(data.codigo);
        if (existingByCodigo) {
          throw new ValidationError('El código de estudiante ya existe');
        }
      }

      // Check if DNI already exists (if being updated)
      if (data.dni && data.dni !== existing.dni) {
        const existingByDni = await this.estudianteRepository.findByDni(data.dni);
        if (existingByDni) {
          throw new ValidationError('El DNI ya está registrado');
        }
      }

      // Validate email format if provided
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new ValidationError('Formato de email inválido');
        }
      }

      logger.info('Updating estudiante', { id });
      const result = await super.update(id, data);
      if (!result) {
        throw new NotFoundError('Estudiante');
      }
      return result;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to update estudiante:', error);
      throw error;
    }
  }

  async findAll(query: IPaginationQuery & {
    codigo?: string;
    nombres?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    dni?: string;
    activo?: boolean;
  } = {}): Promise<IPaginatedResponse<Estudiante>> {
    try {
      const {
        page = 1,
        limit = 20,
        codigo,
        nombres,
        apellido_paterno,
        apellido_materno,
        dni,
        activo,
      } = query;

      const result = await this.estudianteRepository.advancedSearch({
        codigo,
        nombres,
        apellido_paterno,
        apellido_materno,
        dni,
        activo,
        page,
        limit,
      });

      const totalPages = Math.ceil(result.total / limit);

      return {
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to find all estudiantes:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Estudiante> {
    try {
      const result = await this.estudianteRepository.findWithDetails(id);
      if (!result) {
        throw new NotFoundError('Estudiante');
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to find estudiante by id:', error);
      throw error;
    }
  }

  async search(query: string): Promise<Estudiante[]> {
    try {
      if (!query || query.trim().length < 2) {
        throw new ValidationError('La búsqueda debe tener al menos 2 caracteres');
      }

      return await this.estudianteRepository.searchByNombreOrApellido(query.trim());
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Failed to search estudiantes:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existing = await this.estudianteRepository.findById(id);
      if (!existing) {
        throw new NotFoundError('Estudiante');
      }

      // Soft delete
      const result = await this.estudianteRepository.softDelete(id);
      if (!result) {
        throw new NotFoundError('Estudiante');
      }

      logger.info('Estudiante soft deleted', { id });
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Failed to delete estudiante:', error);
      throw error;
    }
  }

  protected async validateCreate(data: CreateEstudianteData): Promise<void> {
    if (!data.codigo || data.codigo.trim().length === 0) {
      throw new ValidationError('El código es requerido');
    }

    if (!data.apellido_paterno || data.apellido_paterno.trim().length === 0) {
      throw new ValidationError('El apellido paterno es requerido');
    }

    if (!data.apellido_materno || data.apellido_materno.trim().length === 0) {
      throw new ValidationError('El apellido materno es requerido');
    }

    if (!data.nombres || data.nombres.trim().length === 0) {
      throw new ValidationError('Los nombres son requeridos');
    }

    // Validate DNI format if provided (Peru: 8 digits)
    if (data.dni) {
      const dniRegex = /^\d{8}$/;
      if (!dniRegex.test(data.dni)) {
        throw new ValidationError('El DNI debe tener 8 dígitos');
      }
    }
  }

  protected async validateUpdate(id: string, data: UpdateEstudianteData): Promise<void> {
    // Validate DNI format if provided
    if (data.dni) {
      const dniRegex = /^\d{8}$/;
      if (!dniRegex.test(data.dni)) {
        throw new ValidationError('El DNI debe tener 8 dígitos');
      }
    }
  }
}
