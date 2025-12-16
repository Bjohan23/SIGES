import { Request, Response, NextFunction } from 'express';

export interface IController {
  handleRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ICreateController<T> extends IController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IReadController<T> extends IController {
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IUpdateController<T> extends IController {
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IDeleteController<T> extends IController {
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ICrudController<T> extends
  ICreateController<T>,
  IReadController<T>,
  IUpdateController<T>,
  IDeleteController<T>
{}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}