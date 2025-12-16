import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface AuditOptions {
  resource: string;
  action: string;
  getSensitiveData?: (req: Request) => any;
}

export function auditAction(options: AuditOptions) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // Store original res.json to intercept response
    const originalJson = res.json;

    let responseData: any;
    res.json = function(data: any) {
      responseData = data;
      return originalJson.call(this, data);
    };

    // Continue with the request
    res.on('finish', async () => {
      try {
        if (req.user) {
          const sensitiveData = options.getSensitiveData ? options.getSensitiveData(req) : null;

          await prisma.auditoria.create({
            data: {
              accion: options.action,
              recurso: options.resource,
              id_recurso: req.params.id || req.body.id || 'unknown',
              id_usuario: req.user.id,
              ip: req.ip,
              user_agent: req.get('User-Agent'),
              datos_sensibles: sensitiveData,
              estado: res.statusCode >= 400 ? 'FALLIDO' : 'EXITOSO',
            },
          });

          logger.info('Audit log created', {
            action: options.action,
            resource: options.resource,
            userId: req.user.id,
            statusCode: res.statusCode,
          });
        }
      } catch (error) {
        logger.error('Failed to create audit log:', error);
        // Don't fail the request if audit logging fails
      }
    });

    next();
  };
}

export async function getAuditLogs(
  userId?: string,
  resourceId?: string,
  resource?: string,
  action?: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  limit: number = 50
) {
  const where: any = {};

  if (userId) where.id_usuario = userId;
  if (resourceId) where.id_recurso = resourceId;
  if (resource) where.recurso = resource;
  if (action) where.accion = action;
  if (startDate || endDate) {
    where.fecha = {};
    if (startDate) where.fecha.gte = startDate;
    if (endDate) where.fecha.lte = endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditoria.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombres: true,
            apellidos: true,
          },
        },
      },
    }),
    prisma.auditoria.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}