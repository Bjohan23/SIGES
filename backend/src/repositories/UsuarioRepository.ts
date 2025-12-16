import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { Usuario } from '@prisma/client';
import { prisma } from '@/config/database';

export class UsuarioRepository extends BaseRepository<Usuario> {
  constructor() {
    super(prisma, 'usuario');
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    try {
      const result = await this.getModel().findUnique({ where: { email } });
      return result;
    } catch (error) {
      logger.error('Failed to find user by email:', error);
      throw new DatabaseError('Failed to find user by email');
    }
  }

  async findByDni(dni: string): Promise<Usuario | null> {
    try {
      const result = await this.getModel().findUnique({ where: { dni } });
      return result;
    } catch (error) {
      logger.error('Failed to find user by DNI:', error);
      throw new DatabaseError('Failed to find user by DNI');
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.getModel().update({
        where: { id },
        data: { ultimo_login: new Date() },
      });
    } catch (error) {
      logger.error('Failed to update last login:', error);
      throw new DatabaseError('Failed to update last login');
    }
  }

  async findWithRole(id: string): Promise<Usuario | null> {
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
      });
      return result;
    } catch (error) {
      logger.error('Failed to find user with role:', error);
      throw new DatabaseError('Failed to find user with role');
    }
  }

  async findActiveUsers(): Promise<Usuario[]> {
    try {
      const result = await this.getModel().findMany({
        where: { activo: true },
        include: {
          rol: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
      return result;
    } catch (error) {
      logger.error('Failed to find active users:', error);
      throw new DatabaseError('Failed to find active users');
    }
  }

  async searchUsers(query: string): Promise<Usuario[]> {
    try {
      const result = await this.getModel().findMany({
        where: {
          AND: [
            { activo: true },
            {
              OR: [
                { nombres: { contains: query, mode: 'insensitive' } },
                { apellidos: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { dni: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true,
          email: true,
          nombres: true,
          apellidos: true,
          dni: true,
          telefono: true,
          activo: true,
          rol: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        take: 20,
      });
      return result;
    } catch (error) {
      logger.error('Failed to search users:', error);
      throw new DatabaseError('Failed to search users');
    }
  }

  async changeStatus(id: string, activo: boolean): Promise<Usuario | null> {
    try {
      const result = await this.getModel().update({
        where: { id },
        data: { activo },
      });
      return result;
    } catch (error) {
      logger.error('Failed to change user status:', error);
      throw new DatabaseError('Failed to change user status');
    }
  }

  async verifyEmail(id: string): Promise<Usuario | null> {
    try {
      const result = await this.getModel().update({
        where: { id },
        data: { email_verificado: true },
      });
      return result;
    } catch (error) {
      logger.error('Failed to verify email:', error);
      throw new DatabaseError('Failed to verify email');
    }
  }
}