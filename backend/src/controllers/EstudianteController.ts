import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { EstudianteService, CreateEstudianteData, UpdateEstudianteData } from '@/services/EstudianteService';

export class EstudianteController extends BaseController {
  private estudianteService: EstudianteService;

  constructor() {
    super();
    this.estudianteService = new EstudianteService();
  }

  /**
   * Get all estudiantes (with pagination and filtering)
   * GET /api/v1/estudiantes
   */
  getAllEstudiantes = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ALL_ESTUDIANTES');

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const codigo = req.query.codigo as string;
    const nombres = req.query.nombres as string;
    const apellido_paterno = req.query.apellido_paterno as string;
    const apellido_materno = req.query.apellido_materno as string;
    const dni = req.query.dni as string;
    const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;

    const result = await this.estudianteService.findAll({
      page,
      limit,
      codigo,
      nombres,
      apellido_paterno,
      apellido_materno,
      dni,
      activo,
    });

    this.paginated(res, result.data, result.pagination);
  });

  /**
   * Get estudiante by ID
   * GET /api/v1/estudiantes/:id
   */
  getEstudianteById = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'GET_ESTUDIANTE_BY_ID');

    const { id } = req.params;
    const estudiante = await this.estudianteService.findById(id);

    this.success(res, { estudiante });
  });

  /**
   * Search estudiantes by nombre or apellido
   * GET /api/v1/estudiantes/search/:query
   */
  searchEstudiantes = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'SEARCH_ESTUDIANTES');

    const { query } = req.params;
    const estudiantes = await this.estudianteService.search(query);

    this.success(res, { estudiantes });
  });

  /**
   * Create new estudiante
   * POST /api/v1/estudiantes
   */
  createEstudiante = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'CREATE_ESTUDIANTE');

    const userId = this.getUserIdFromRequest(req) || undefined;

    const data: CreateEstudianteData = {
      codigo: req.body.codigo,
      apellido_paterno: req.body.apellido_paterno,
      apellido_materno: req.body.apellido_materno,
      nombres: req.body.nombres,
      fecha_nacimiento: req.body.fecha_nacimiento ? new Date(req.body.fecha_nacimiento) : undefined,
      dni: req.body.dni,
      telefono: req.body.telefono,
      email: req.body.email,
      direccion: req.body.direccion,
      created_by: userId,
    };

    const estudiante = await this.estudianteService.create(data);

    this.created(res, { estudiante });
  });

  /**
   * Update estudiante
   * PUT /api/v1/estudiantes/:id
   */
  updateEstudiante = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'UPDATE_ESTUDIANTE');

    const { id } = req.params;
    const userId = this.getUserIdFromRequest(req) || undefined;

    const data: UpdateEstudianteData = {
      codigo: req.body.codigo,
      apellido_paterno: req.body.apellido_paterno,
      apellido_materno: req.body.apellido_materno,
      nombres: req.body.nombres,
      fecha_nacimiento: req.body.fecha_nacimiento ? new Date(req.body.fecha_nacimiento) : undefined,
      dni: req.body.dni,
      telefono: req.body.telefono,
      email: req.body.email,
      direccion: req.body.direccion,
      activo: req.body.activo,
      updated_by: userId,
    };

    const estudiante = await this.estudianteService.update(id, data);

    this.success(res, { estudiante });
  });

  /**
   * Delete estudiante (soft delete)
   * DELETE /api/v1/estudiantes/:id
   */
  deleteEstudiante = this.asyncHandler(async (req: Request, res: Response) => {
    this.logRequest(req, 'DELETE_ESTUDIANTE');

    const { id } = req.params;
    await this.estudianteService.delete(id);

    this.success(res, { message: 'Estudiante eliminado correctamente' });
  });
}
