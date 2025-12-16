import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { prisma } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roleId: string;
    permissions: string[];
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token required',
        statusCode: 401,
        isOperational: true,
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      roleId: decoded.roleId,
      permissions: decoded.permissions || [],
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        statusCode: 401,
        isOperational: true,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

export function authorizePermissions(permissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    const userPermissions = req.user.permissions;
    const hasPermission = permissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new AuthorizationError(`Required permissions: ${permissions.join(', ')}`));
    }

    next();
  };
}

export function authorizeRoles(roles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    try {
      const userRole = await prisma.rol.findUnique({
        where: { id: req.user.roleId },
        include: {
          modulos: {
            include: { modulo: true }
          }
        }
      });

      if (!userRole || !roles.includes(userRole.nombre)) {
        return next(new AuthorizationError(`Required roles: ${roles.join(', ')}`));
      }

      // Update user permissions from role
      req.user.permissions = userRole.modulos.map(m => m.modulo.codigo);

      next();
    } catch (error) {
      next(new AuthorizationError('Authorization check failed'));
    }
  };
}

export function authorizeOwnership(resourceIdParam: string = 'id') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // Admin users can access any resource
    if (req.user.permissions.includes('ADMIN')) {
      return next();
    }

    try {
      // Check if user owns the resource
      const resource = await prisma.fichaSocial.findFirst({
        where: {
          id: resourceId,
          created_by: userId
        }
      });

      if (!resource) {
        return next(new AuthorizationError('Access denied: Resource not found or no ownership'));
      }

      next();
    } catch (error) {
      next(new AuthorizationError('Ownership verification failed'));
    }
  };
}