import { IService, IPaginationQuery, IPaginatedResponse } from '@/interfaces/IService';
import { IRepository } from '@/interfaces/IRepository';
import { AppError, NotFoundError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export abstract class BaseService<T, K = string> implements IService<T, K> {
  protected repository: IRepository<T, K>;

  constructor(repository: IRepository<T, K>) {
    this.repository = repository;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      logger.info(`Creating ${this.getEntityName()}`, { data });
      return await this.repository.create(data);
    } catch (error) {
      logger.error(`Failed to create ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  async findById(id: K): Promise<T | null> {
    try {
      const entity = await this.repository.findById(id);
      if (!entity) {
        throw new NotFoundError(this.getEntityName());
      }
      return entity;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(`Failed to find ${this.getEntityName()} by id:`, error);
      throw error;
    }
  }

  async findAll(query: IPaginationQuery & { where?: any } = {}): Promise<IPaginatedResponse<T>> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc',
        where,
      } = query;

      const skip = (page - 1) * limit;
      const orderBy = { [sortBy]: sortOrder };

      const [data, total] = await Promise.all([
        this.repository.findAll({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        this.repository.count({ where }),
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
      logger.error(`Failed to find all ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  async update(id: K, data: Partial<T>): Promise<T | null> {
    try {
      logger.info(`Updating ${this.getEntityName()}`, { id, data });
      const entity = await this.repository.update(id, data);
      if (!entity) {
        throw new NotFoundError(this.getEntityName());
      }
      return entity;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(`Failed to update ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  async delete(id: K): Promise<boolean> {
    try {
      logger.info(`Deleting ${this.getEntityName()}`, { id });
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        throw new NotFoundError(this.getEntityName());
      }
      return deleted;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(`Failed to delete ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  protected abstract getEntityName(): string;

  protected async validateCreate(data: Partial<T>): Promise<void> {
    // Override in subclasses for validation logic
  }

  protected async validateUpdate(id: K, data: Partial<T>): Promise<void> {
    // Override in subclasses for validation logic
  }

  protected async checkPermissions(
    userId: string,
    action: string,
    resourceId?: K
  ): Promise<boolean> {
    // Override in subclasses for permission logic
    return true;
  }

  protected sanitizeData(data: Partial<T>): Partial<T> {
    // Override in subclasses to sanitize input data
    return data;
  }

  protected transformData(entity: T): T {
    // Override in subclasses to transform output data
    return entity;
  }
}