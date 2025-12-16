import { PrismaClient } from '@prisma/client';

export interface IRepository<T, K = string> {
  create(data: Partial<T>): Promise<T>;
  findById(id: K): Promise<T | null>;
  findAll(options?: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]>;
  update(id: K, data: Partial<T>): Promise<T | null>;
  delete(id: K): Promise<boolean>;
  count(options?: { where?: any }): Promise<number>;
}

export interface ITransactionRepository<T, K = string> extends IRepository<T, K> {
  createWithTransaction(data: Partial<T>, tx: PrismaClient): Promise<T>;
  updateWithTransaction(id: K, data: Partial<T>, tx: PrismaClient): Promise<T | null>;
  deleteWithTransaction(id: K, tx: PrismaClient): Promise<boolean>;
}