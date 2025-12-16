import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BaseController } from './BaseController';

const prisma = new PrismaClient();

export class FichaSocialController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get all fichas sociales (with pagination and filtering)
   */
  getAllFichas = async (req: Request, res: Response) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const skip = (page - 1) * limit;

      const where: any = {};

      // Filter by estado
      if (req.query.estado) {
        where.estado = req.query.estado;
      }

      // Filter by distrito
      if (req.query.distrito) {
        where.distrito = {
          contains: req.query.distrito as string,
          mode: 'insensitive'
        };
      }

      // Search by nombres or apellidos
      if (req.query.search) {
        where.OR = [
          {
            nombres: {
              contains: req.query.search as string,
              mode: 'insensitive'
            }
          },
          {
            apellidos: {
              contains: req.query.search as string,
              mode: 'insensitive'
            }
          },
          {
            dni: {
              contains: req.query.search as string,
              mode: 'insensitive'
            }
          }
        ];
      }

      const [fichas, total] = await Promise.all([
        prisma.fichaSocial.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc'
          },
          include: {
            creador: {
              select: {
                id: true,
                nombres: true,
                apellidos: true
              }
            },
            actualizador: {
              select: {
                id: true,
                nombres: true,
                apellidos: true
              }
            },
            _count: {
              select: {
                entrevistas: true
              }
            }
          }
        }),
        prisma.fichaSocial.count({ where })
      ]);

      const pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      };

      this.success(res, {
        fichas,
        pagination
      });
    } catch (error) {
      console.error('Error getting fichas sociales:', error);
      this.error(res, {
        message: 'Error fetching fichas sociales',
        statusCode: 500,
        isOperational: true
      });
    }
  };

  /**
   * Get ficha social by ID
   */
  getFichaById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const ficha = await prisma.fichaSocial.findUnique({
        where: { id },
        include: {
          creador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true
            }
          },
          actualizador: {
            select: {
              id: true,
              nombres: true,
              apellidos: true
            }
          },
          entrevistas: {
            include: {
              creador: {
                select: {
                  nombres: true,
                  apellidos: true
                }
              }
            },
            orderBy: {
              created_at: 'desc'
            }
          }
        }
      });

      if (!ficha) {
        return this.error(res, {
          message: 'Ficha social not found',
          statusCode: 404,
          isOperational: true
        });
      }

      this.success(res, { ficha });
    } catch (error) {
      console.error('Error getting ficha social:', error);
      this.error(res, {
        message: 'Error fetching ficha social',
        statusCode: 500,
        isOperational: true
      });
    }
  };

  /**
   * Create new ficha social
   */
  createFicha = async (req: Request, res: Response) => {
    try {
      const {
        nombres,
        apellidos,
        sexo,
        nacionalidad,
        fecha_nacimiento,
        dni,
        carne_extranjeria,
        nivel_educativo,
        estado_civil,
        num_hijos,
        domicilio_actual,
        distrito,
        datos_vivienda,
        datos_salud,
        datos_economicos,
        declaracion_jurada
      } = req.body;

      const userId = req.user?.id;

      const ficha = await prisma.fichaSocial.create({
        data: {
          nombres,
          apellidos,
          sexo,
          nacionalidad,
          fecha_nacimiento: new Date(fecha_nacimiento),
          dni,
          carne_extranjeria,
          nivel_educativo,
          estado_civil,
          num_hijos: num_hijos || 0,
          domicilio_actual,
          distrito,
          datos_vivienda: datos_vivienda || {},
          datos_salud: datos_salud || {},
          datos_economicos: datos_economicos || {},
          declaracion_jurada: declaracion_jurada || {},
          created_by: userId,
          updated_by: userId,
          porcentaje_completado: this.calculateCompletionPercentage(req.body)
        },
        include: {
          creador: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        }
      });

      this.created(res, { ficha });
    } catch (error) {
      console.error('Error creating ficha social:', error);
      this.error(res, {
        message: 'Error creating ficha social',
        statusCode: 500,
        isOperational: true
      });
    }
  };

  /**
   * Update ficha social
   */
  updateFicha = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const updateData = { ...req.body };

      if (updateData.fecha_nacimiento) {
        updateData.fecha_nacimiento = new Date(updateData.fecha_nacimiento);
      }

      updateData.updated_by = userId;
      updateData.porcentaje_completado = this.calculateCompletionPercentage({
        ...req.body,
        id // Include existing ID for completion calculation
      });

      const ficha = await prisma.fichaSocial.update({
        where: { id },
        data: updateData,
        include: {
          creador: {
            select: {
              nombres: true,
              apellidos: true
            }
          },
          actualizador: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        }
      });

      this.success(res, { ficha });
    } catch (error) {
      console.error('Error updating ficha social:', error);
      this.error(res, {
        message: 'Error updating ficha social',
        statusCode: 500,
        isOperational: true
      });
    }
  };

  /**
   * Delete ficha social
   */
  deleteFicha = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if ficha exists
      const existingFicha = await prisma.fichaSocial.findUnique({
        where: { id }
      });

      if (!existingFicha) {
        return this.error(res, {
          message: 'Ficha social not found',
          statusCode: 404,
          isOperational: true
        });
      }

      // Delete ficha (this will also delete related interviews due to cascade)
      await prisma.fichaSocial.delete({
        where: { id }
      });

      this.success(res, {
        message: 'Ficha social deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting ficha social:', error);
      this.error(res, {
        message: 'Error deleting ficha social',
        statusCode: 500,
        isOperational: true
      });
    }
  };

  /**
   * Helper method to calculate completion percentage
   */
  private calculateCompletionPercentage(data: any): number {
    const requiredFields = [
      'nombres',
      'apellidos',
      'fecha_nacimiento',
      'domicilio_actual',
      'distrito'
    ];

    const optionalFields = [
      'dni',
      'sexo',
      'nacionalidad',
      'nivel_educativo',
      'estado_civil',
      'num_hijos'
    ];

    let completed = 0;
    const totalFields = requiredFields.length + optionalFields.length;

    // Check required fields
    requiredFields.forEach(field => {
      if (data[field] && data[field] !== '') completed++;
    });

    // Check optional fields
    optionalFields.forEach(field => {
      if (data[field] && data[field] !== '') completed++;
    });

    return Math.round((completed / totalFields) * 100);
  }
}