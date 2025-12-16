import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BaseController } from './BaseController';

const prisma = new PrismaClient();

export class DashboardController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get dashboard statistics
   */
  getStatistics = async (req: Request, res: Response) => {
    try {
      // Get counts for main entities
      const [
        totalUsuarios,
        totalFichasSociales,
        totalEntrevistas,
        fichasPorEstado,
        entrevistasPorEstado,
        usuariosPorRol
      ] = await Promise.all([
        // Total active users
        prisma.usuario.count({
          where: { activo: true }
        }),

        // Total fichas sociales
        prisma.fichaSocial.count(),

        // Total entrevistas
        prisma.entrevistaAplicada.count(),

        // Fichas por estado
        prisma.fichaSocial.groupBy({
          by: ['estado'],
          _count: true
        }),

        // Entrevistas por estado
        prisma.entrevistaAplicada.groupBy({
          by: ['estado'],
          _count: true
        }),

        // Usuarios por rol
        prisma.usuario.groupBy({
          by: ['rol_id'],
          _count: true,
          where: { activo: true }
        })
      ]);

      // Get role names for user counts
      const roles = await prisma.rol.findMany({
        where: {
          id: {
            in: usuariosPorRol.map(r => r.rol_id)
          }
        },
        select: {
          id: true,
          nombre: true
        }
      });

      // Map role IDs to names
      const usuariosPorRolConNombres = usuariosPorRol.map(r => {
        const role = roles.find(rol => rol.id === r.rol_id);
        return {
          rol_nombre: role?.nombre || 'Desconocido',
          cantidad: r._count
        };
      });

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [
        fichasRecientes,
        entrevistasRecientes,
        usuariosRecientes
      ] = await Promise.all([
        prisma.fichaSocial.count({
          where: {
            created_at: {
              gte: sevenDaysAgo
            }
          }
        }),

        prisma.entrevistaAplicada.count({
          where: {
            created_at: {
              gte: sevenDaysAgo
            }
          }
        }),

        prisma.usuario.count({
          where: {
            created_at: {
              gte: sevenDaysAgo
            },
            activo: true
          }
        })
      ]);

      const statistics = {
        resumen: {
          totalUsuarios,
          totalFichasSociales,
          totalEntrevistas,
          actividadReciente: {
            fichasNuevas: fichasRecientes,
            entrevistasNuevas: entrevistasRecientes,
            usuariosNuevos: usuariosRecientes
          }
        },
        fichasSociales: {
          totalPorEstado: fichasPorEstado.map(f => ({
            estado: f.estado,
            cantidad: f._count
          }))
        },
        entrevistas: {
          totalPorEstado: entrevistasPorEstado.map(e => ({
            estado: e.estado,
            cantidad: e._count
          }))
        },
        usuarios: {
          totalPorRol: usuariosPorRolConNombres
        }
      };

      this.success(res, statistics);
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      this.error(res, {
        message: 'Error fetching dashboard statistics',
        statusCode: 500,
        isOperational: true
      });
    }
  };

  /**
   * Get recent activity feed
   */
  getRecentActivity = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get recent fichas sociales
      const fichasRecientes = await prisma.fichaSocial.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          created_at: 'desc'
        },
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          estado: true,
          created_at: true,
          creador: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        }
      });

      // Get recent entrevistas
      const entrevistasRecientes = await prisma.entrevistaAplicada.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          created_at: 'desc'
        },
        select: {
          id: true,
          estudiante_nombres: true,
          estudiante_apellidos: true,
          estado: true,
          created_at: true,
          creador: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        }
      });

      // Combine and sort activities
      const activities = [
        ...fichasRecientes.map(f => ({
          id: f.id,
          tipo: 'FICHA_SOCIAL',
          descripcion: `Ficha social creada para ${f.nombres} ${f.apellidos}`,
          estado: f.estado,
          creado_por: f.creador ? `${f.creador.nombres} ${f.creador.apellidos}` : 'Sistema',
          fecha: f.created_at
        })),
        ...entrevistasRecientes.map(e => ({
          id: e.id,
          tipo: 'ENTREVISTA',
          descripcion: `Entrevista aplicada a ${e.estudiante_nombres} ${e.estudiante_apellidos}`,
          estado: e.estado,
          creado_por: e.creador ? `${e.creador.nombres} ${e.creador.apellidos}` : 'Sistema',
          fecha: e.created_at
        }))
      ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
       .slice(0, limit);

      this.success(res, {
        activities,
        total: activities.length
      });
    } catch (error) {
      console.error('Error getting recent activity:', error);
      this.error(res, {
        message: 'Error fetching recent activity',
        statusCode: 500,
        isOperational: true
      });
    }
  };
}