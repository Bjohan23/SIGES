import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BaseController } from './BaseController';

const prisma = new PrismaClient();

export class UserController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get current user profile (authenticated user)
   */
  getCurrentUserProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return this.sendError(res, 401, 'User not authenticated');
      }

      const authUserId = req.user.id;
      const userProfile = await prisma.usuario.findUnique({
        where: {
          id: authUserId
        },
        include: {
          rol: {
            select: {
              id: true,
              nombre: true,
              descripcion: true
            }
          }
        }
      });

      if (!userProfile) {
        return this.sendError(res, 404, 'User profile not found');
      }

      this.sendSuccess(res, 200, userProfile, 'User profile retrieved successfully');
    } catch (error) {
      console.error('Error getting current user profile:', error);
      this.sendError(res, 500, 'Internal server error');
    }
  }

  /**
   * Get user profile by auth user ID
   */
  getUserProfile = async (req: Request, res: Response) => {
    try {
      const { authUserId } = req.params;

      const userProfile = await prisma.usuario.findFirst({
        where: {
          auth_user_id: authUserId,
          activo: true
        },
        include: {
          rol: {
            select: {
              id: true,
              nombre: true,
              descripcion: true
            }
          }
        }
      });

      if (!userProfile) {
        return this.sendError(res, 404, 'User profile not found');
      }

      this.sendSuccess(res, 200, userProfile, 'User profile retrieved successfully');
    } catch (error) {
      console.error('Error getting user profile:', error);
      this.sendError(res, 500, 'Internal server error');
    }
  }

  /**
   * Get user profile by user ID
   */
  getUserProfileById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const userProfile = await prisma.usuario.findUnique({
        where: {
          id: userId,
          activo: true
        },
        include: {
          rol: {
            select: {
              id: true,
              nombre: true,
              descripcion: true
            }
          }
        }
      });

      if (!userProfile) {
        return this.sendError(res, 404, 'User profile not found');
      }

      this.sendSuccess(res, 200, userProfile, 'User profile retrieved successfully');
    } catch (error) {
      console.error('Error getting user profile by ID:', error);
      this.sendError(res, 500, 'Internal server error');
    }
  }

  /**
   * Get user ID by auth user ID
   */
  getUserIdByAuthId = async (req: Request, res: Response) => {
    try {
      const { authUserId } = req.params;

      const user = await prisma.usuario.findFirst({
        where: {
          auth_user_id: authUserId,
          activo: true
        },
        select: {
          id: true
        }
      });

      if (!user) {
        return this.sendError(res, 404, 'User not found');
      }

      this.sendSuccess(res, 200, { id: user.id }, 'User ID retrieved successfully');
    } catch (error) {
      console.error('Error getting user ID by auth ID:', error);
      this.sendError(res, 500, 'Internal server error');
    }
  }
}