import { IPaginationQuery, IPaginatedResponse } from './IController';

export interface IService<T, K = string> {
  create(data: Partial<T>): Promise<T>;
  findById(id: K): Promise<T | null>;
  findAll(query?: IPaginationQuery & { where?: any }): Promise<IPaginatedResponse<T>>;
  update(id: K, data: Partial<T>): Promise<T | null>;
  delete(id: K): Promise<boolean>;
}

export interface IServiceWithValidation<T, K = string> extends IService<T, K> {
  validate(data: Partial<T>): Promise<void>;
  validateUpdate(id: K, data: Partial<T>): Promise<void>;
}

export interface IAuthService {
  authenticate(credentials: { email: string; password: string }): Promise<{ token: string; user: any }>;
  validateToken(token: string): Promise<any>;
  refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }>;
  logout(token: string): Promise<void>;
}

export interface IAuditService {
  log(action: string, resource: string, resourceId: string, userId: string, details?: any): Promise<void>;
  getAuditLogs(filters: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]>;
}