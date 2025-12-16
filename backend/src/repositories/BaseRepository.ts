import { PrismaClient, Prisma } from '@prisma/client';
import { IRepository, ITransactionRepository } from '@/interfaces/IRepository';
import { logger } from '@/utils/logger';
import { DatabaseError } from '@/utils/errors';

export abstract class BaseRepository<T, K = string> implements IRepository<T, K>, ITransactionRepository<T, K> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  protected getModel(): any {
    return (this.prisma as any)[this.modelName];
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      logger.debug(`Creating ${this.modelName}`, data);
      const result = await this.getModel().create({ data });
      logger.info(`${this.modelName} created successfully`, { id: result.id });
      return result;
    } catch (error) {
      logger.error(`Failed to create ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to create ${this.modelName}`);
    }
  }

  async findById(id: K): Promise<T | null> {
    try {
      const result = await this.getModel().findUnique({ where: { id } });
      return result;
    } catch (error) {
      logger.error(`Failed to find ${this.modelName} by id:`, error);
      throw new DatabaseError(`Failed to find ${this.modelName}`);
    }
  }

  async findAll(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  } = {}): Promise<T[]> {
    try {
      const { where, include, orderBy, skip, take } = options;
      const result = await this.getModel().findMany({
        where,
        include,
        orderBy,
        skip,
        take,
      });
      return result;
    } catch (error) {
      logger.error(`Failed to find all ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to find ${this.modelName}`);
    }
  }

  async update(id: K, data: Partial<T>): Promise<T | null> {
    try {
      logger.debug(`Updating ${this.modelName}`, { id, data });
      const result = await this.getModel().update({
        where: { id },
        data,
      });
      logger.info(`${this.modelName} updated successfully`, { id });
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        logger.warn(`${this.modelName} not found for update`, { id });
        return null;
      }
      logger.error(`Failed to update ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to update ${this.modelName}`);
    }
  }

  async delete(id: K): Promise<boolean> {
    try {
      logger.debug(`Deleting ${this.modelName}`, { id });
      await this.getModel().delete({ where: { id } });
      logger.info(`${this.modelName} deleted successfully`, { id });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        logger.warn(`${this.modelName} not found for deletion`, { id });
        return false;
      }
      logger.error(`Failed to delete ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to delete ${this.modelName}`);
    }
  }

  async count(options: { where?: any } = {}): Promise<number> {
    try {
      const { where } = options;
      return await this.getModel().count({ where });
    } catch (error) {
      logger.error(`Failed to count ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to count ${this.modelName}`);
    }
  }

  async createWithTransaction(data: Partial<T>, tx: PrismaClient): Promise<T> {
    try {
      const model = (tx as any)[this.modelName];
      const result = await model.create({ data });
      return result;
    } catch (error) {
      logger.error(`Failed to create ${this.modelName} with transaction:`, error);
      throw new DatabaseError(`Failed to create ${this.modelName} with transaction`);
    }
  }

  async updateWithTransaction(id: K, data: Partial<T>, tx: PrismaClient): Promise<T | null> {
    try {
      const model = (tx as any)[this.modelName];
      const result = await model.update({
        where: { id },
        data,
      });
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      logger.error(`Failed to update ${this.modelName} with transaction:`, error);
      throw new DatabaseError(`Failed to update ${this.modelName} with transaction`);
    }
  }

  async deleteWithTransaction(id: K, tx: PrismaClient): Promise<boolean> {
    try {
      const model = (tx as any)[this.modelName];
      await model.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return false;
      }
      logger.error(`Failed to delete ${this.modelName} with transaction:`, error);
      throw new DatabaseError(`Failed to delete ${this.modelName} with transaction`);
    }
  }

  async findFirst(options: {
    where?: any;
    include?: any;
    orderBy?: any;
  }): Promise<T | null> {
    try {
      const { where, include, orderBy } = options;
      const result = await this.getModel().findFirst({
        where,
        include,
        orderBy,
      });
      return result;
    } catch (error) {
      logger.error(`Failed to find first ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to find first ${this.modelName}`);
    }
  }

  async findMany(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    cursor?: any;
  }): Promise<T[]> {
    try {
      const result = await this.getModel().findMany(options);
      return result;
    } catch (error) {
      logger.error(`Failed to find many ${this.modelName}:`, error);
      throw new DatabaseError(`Failed to find many ${this.modelName}`);
    }
  }
}