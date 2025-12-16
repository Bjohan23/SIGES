import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { Usuario, Rol, Modulo } from '@prisma/client';
import { prisma } from '@/config/database';

export interface UserWithRole extends Usuario {
  rol: Rol & {
    modulos: Array<{
      modulo: Modulo;
    }>;
  };
}

export class AuthRepository extends BaseRepository<Usuario> {
  constructor() {
    super(prisma, 'usuario');
  }

  async findUserWithRoleByEmail(email: string): Promise<UserWithRole | null> {
    try {
      const result = await this.getModel().findUnique({
        where: { email },
        include: {
          rol: {
            include: {
              modulos: {
                include: {
                  modulo: true,
                },
              },
            },
          },
        },
      }) as UserWithRole | null;
      return result;
    } catch (error) {
      logger.error('Failed to find user with role by email:', error);
      throw new DatabaseError('Failed to find user with role by email');
    }
  }

  async findUserWithRoleById(id: string): Promise<UserWithRole | null> {
    try {
      const result = await this.getModel().findUnique({
        where: { id },
        include: {
          rol: {
            include: {
              modulos: {
                include: {
                  modulo: true,
                },
              },
            },
          },
        },
      }) as UserWithRole | null;
      return result;
    } catch (error) {
      logger.error('Failed to find user with role by id:', error);
      throw new DatabaseError('Failed to find user with role by id');
    }
  }

  async createUser(data: {
    email: string;
    password: string;
    nombres: string;
    apellidos: string;
    dni?: string;
    telefono?: string;
    rolId: string;
  }): Promise<Usuario> {
    try {
      const result = await this.getModel().create({
        data: {
          email: data.email,
          password: data.password,
          nombres: data.nombres,
          apellidos: data.apellidos,
          dni: data.dni,
          telefono: data.telefono,
          rol_id: data.rolId,
        },
        include: {
          rol: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw new DatabaseError('Failed to create user');
    }
  }

  async validateUserCredentials(email: string): Promise<Usuario | null> {
    try {
      const result = await this.getModel().findUnique({
        where: {
          email,
          activo: true,
        },
      });
      return result;
    } catch (error) {
      logger.error('Failed to validate user credentials:', error);
      throw new DatabaseError('Failed to validate user credentials');
    }
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<Usuario | null> {
    try {
      const result = await this.getModel().update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return result;
    } catch (error) {
      logger.error('Failed to update user password:', error);
      throw new DatabaseError('Failed to update user password');
    }
  }

  async findPermissionsByUserId(userId: string): Promise<string[]> {
    try {
      const user = await this.getModel().findUnique({
        where: { id: userId },
        include: {
          rol: {
            include: {
              modulos: {
                include: {
                  modulo: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.rol) {
        return [];
      }

      return user.rol.modulos.map(rm => rm.modulo.codigo);
    } catch (error) {
      logger.error('Failed to find permissions by user id:', error);
      throw new DatabaseError('Failed to find permissions by user id');
    }
  }

  async checkUserPermission(userId: string, permissionCode: string): Promise<boolean> {
    try {
      const permissions = await this.findPermissionsByUserId(userId);
      return permissions.includes(permissionCode) || permissions.includes('ADMIN');
    } catch (error) {
      logger.error('Failed to check user permission:', error);
      throw new DatabaseError('Failed to check user permission');
    }
  }

  async createRefreshToken(userId: string, token: string, expiresIn: Date): Promise<void> {
    // This would typically be stored in a separate refresh_tokens table
    // For now, we'll implement a basic version
    logger.info('Refresh token created for user', { userId });
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    // This would typically invalidate all refresh tokens for the user
    logger.info('Refresh tokens invalidated for user', { userId });
  }

  async validateRefreshToken(token: string): Promise<Usuario | null> {
    // This would validate the refresh token against the stored tokens
    // For now, return null as placeholder
    return null;
  }

  async recordLoginAttempt(
    email: string,
    success: boolean,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    // This would typically record login attempts for security monitoring
    logger.info('Login attempt recorded', {
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date(),
    });
  }

  async findFailedLoginAttempts(email: string, since: Date): Promise<number> {
    // This would count failed login attempts since the given date
    // For now, return 0 as placeholder
    return 0;
  }
}