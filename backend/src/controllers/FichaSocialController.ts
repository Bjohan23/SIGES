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

      // Calcular edad y agregar campos calculados
      const porcentajeCalculado = this.calculateCompletionPercentage(ficha);
      const fichaConDatosCalculados = {
        ...ficha,
        edad: this.calculateAge(ficha.fecha_nacimiento),
        apellido_paterno: ficha.apellidos.split(' ').slice(0, -1).join(' ') || '',
        apellido_materno: ficha.apellidos.split(' ').slice(-1)[0] || '',
        porcentaje_completado: porcentajeCalculado,
        estado: porcentajeCalculado === 100 ? 'COMPLETA' : 'INCOMPLETA'
      };

      this.success(res, { ficha: fichaConDatosCalculados });
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
        composicion_familiar,
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
          composicion_familiar: composicion_familiar || {},
          declaracion_jurada: declaracion_jurada || {},
          created_by: userId,
          updated_by: userId
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

      // Calcular edad y agregar campos calculados para la respuesta
      const porcentajeCalculado = this.calculateCompletionPercentage(ficha);
      const fichaConDatosCalculados = {
        ...ficha,
        edad: this.calculateAge(ficha.fecha_nacimiento),
        apellido_paterno: ficha.apellidos.split(' ').slice(0, -1).join(' ') || '',
        apellido_materno: ficha.apellidos.split(' ').slice(-1)[0] || '',
        porcentaje_completado: porcentajeCalculado,
        estado: porcentajeCalculado === 100 ? 'COMPLETA' : 'INCOMPLETA'
      };

      this.created(res, { ficha: fichaConDatosCalculados });
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
    console.log('🔍 Iniciando cálculo de completamiento para ficha ID:', data.id)
    console.log('📊 Datos completos de la ficha:', JSON.stringify(data, null, 2))

    const camposRequeridos = [
      'nombres',
      'apellidos',
      'tipo_documento',
      'numero_documento',
      'fecha_nacimiento',
      'direccion',
      'distrito'
    ]

    console.log('✅ Campos requeridos a validar:', camposRequeridos)

    let camposCompletos = 0
    const camposValidados: { [key: string]: boolean } = {}

    for (const campo of camposRequeridos) {
      const valor = data[campo]
      const estaCompleto = valor !== null && valor !== undefined && valor !== ''
      camposValidados[campo] = estaCompleto

      if (estaCompleto) {
        camposCompletos++
        console.log(`✅ Campo "${campo}" está completo: "${valor}"`)
      } else {
        console.log(`❌ Campo "${campo}" está vacío o inválido:`, valor)
      }
    }

    console.log('📈 Resumen de campos básicos:', {
      camposCompletos,
      totalCampos: camposRequeridos.length,
      porcentajeBasico: (camposCompletos / camposRequeridos.length) * 100,
      camposValidados
    })

    // Evaluar composicion_familiar
    if (data.composicion_familiar) {
      console.log('👨‍👩‍👧‍👦 Evaluando composicion_familiar:', JSON.stringify(data.composicion_familiar, null, 2))

      try {
        const composicion = typeof data.composicion_familiar === 'string'
          ? JSON.parse(data.composicion_familiar)
          : data.composicion_familiar

        console.log('📋 Composición parseada:', composicion)

        // Verificar datos básicos de la familia
        if (composicion.padre?.nombres && composicion.padre?.apellidos) {
          camposCompletos++
          console.log('✅ Padre completo:', composicion.padre)
        } else {
          console.log('❌ Padre incompleto:', composicion.padre)
        }

        if (composicion.madre?.nombres && composicion.madre?.apellidos) {
          camposCompletos++
          console.log('✅ Madre completa:', composicion.madre)
        } else {
          console.log('❌ Madre incompleta:', composicion.madre)
        }

        // Verificar hijos
        if (composicion.hijos && Array.isArray(composicion.hijos) && composicion.hijos.length > 0) {
          console.log('🧒 Evaluando hijos:', composicion.hijos.length)

          for (let i = 0; i < composicion.hijos.length; i++) {
            const hijo = composicion.hijos[i]
            console.log(`👶 Evaluando hijo ${i + 1}:`, JSON.stringify(hijo, null, 2))

            if (hijo.nombres && hijo.apellidos) {
              camposCompletos++
              console.log(`✅ Hijo ${i + 1} completo:`, `${hijo.nombres} ${hijo.apellidos}`)
            } else {
              console.log(`❌ Hijo ${i + 1} incompleto:`, hijo)
            }
          }
        } else {
          console.log('📝 No hay hijos o array vacío')
        }

        // Verificar datos adicionales
        if (composicion.vive_con_familia !== undefined) {
          camposCompletos++
          console.log('✅ Vive con familia:', composicion.vive_con_familia)
        } else {
          console.log('❌ Vive con familia no definido')
        }

        if (composicion.parentesco_a_cargo !== undefined) {
          camposCompletos++
          console.log('✅ Parentesco a cargo:', composicion.parentesco_a_cargo)
        } else {
          console.log('❌ Parentesco a cargo no definido')
        }

      } catch (error) {
        console.error('❌ Error al procesar composicion_familiar:', error)
      }
    } else {
      console.log('❌ No hay datos de composicion_familiar')
    }

    // Evaluar datos de salud
    if (data.datos_salud) {
      console.log('🏥 Evaluando datos_salud:', JSON.stringify(data.datos_salud, null, 2))

      try {
        const datosSalud = typeof data.datos_salud === 'string'
          ? JSON.parse(data.datos_salud)
          : data.datos_salud

        if (datosSalud) {
          if (datosSalud.tiene_seguro !== undefined) {
            camposCompletos++
            console.log('✅ Tiene seguro:', datosSalud.tiene_seguro)
          }

          if (datosSalud.tipo_seguro) {
            camposCompletos++
            console.log('✅ Tipo de seguro:', datosSalud.tipo_seguro)
          }

          if (datosSalud.centro_salud) {
            camposCompletos++
            console.log('✅ Centro de salud:', datosSalud.centro_salud)
          }

          if (datosSalud.enfermedades_cronicas !== undefined) {
            camposCompletos++
            console.log('✅ Enfermedades crónicas:', datosSalud.enfermedades_cronicas)
          }

          if (datosSalud.discapacidad !== undefined) {
            camposCompletos++
            console.log('✅ Discapacidad:', datosSalud.discapacidad)
          }

          if (datosSalud.tipo_discapacidad) {
            camposCompletos++
            console.log('✅ Tipo de discapacidad:', datosSalud.tipo_discapacidad)
          }
        }
      } catch (error) {
        console.error('❌ Error al procesar datos_salud:', error)
      }
    } else {
      console.log('❌ No hay datos de salud')
    }

    // Evaluar datos económicos
    if (data.datos_economicos) {
      console.log('💰 Evaluando datos_economicos:', JSON.stringify(data.datos_economicos, null, 2))

      try {
        const datosEconomicos = typeof data.datos_economicos === 'string'
          ? JSON.parse(data.datos_economicos)
          : data.datos_economicos

        if (datosEconomicos) {
          if (datosEconomicos.ingreso_mensual !== undefined && datosEconomicos.ingreso_mensual > 0) {
            camposCompletos++
            console.log('✅ Ingreso mensual:', datosEconomicos.ingreso_mensual)
          }

          if (datosEconomicos.fuente_ingreso) {
            camposCompletos++
            console.log('✅ Fuente de ingreso:', datosEconomicos.fuente_ingreso)
          }

          if (datosEconomicos.trabajo_formal !== undefined) {
            camposCompletos++
            console.log('✅ Trabajo formal:', datosEconomicos.trabajo_formal)
          }

          if (datosEconomicos.numero_trabajadores_hogar !== undefined) {
            camposCompletos++
            console.log('✅ N° trabajadores en hogar:', datosEconomicos.numero_trabajadores_hogar)
          }
        }
      } catch (error) {
        console.error('❌ Error al procesar datos_economicos:', error)
      }
    } else {
      console.log('❌ No hay datos económicos')
    }

    // Evaluar datos de vivienda
    if (data.datos_vivienda) {
      console.log('🏠 Evaluando datos_vivienda:', JSON.stringify(data.datos_vivienda, null, 2))

      try {
        const datosVivienda = typeof data.datos_vivienda === 'string'
          ? JSON.parse(data.datos_vivienda)
          : data.datos_vivienda

        if (datosVivienda) {
          if (datosVivienda.tipo_vivienda) {
            camposCompletos++
            console.log('✅ Tipo de vivienda:', datosVivienda.tipo_vivienda)
          }

          if (datosVivienda.material_paredes) {
            camposCompletos++
            console.log('✅ Material de paredes:', datosVivienda.material_paredes)
          }

          if (datosVivienda.material_techos) {
            camposCompletos++
            console.log('✅ Material de techos:', datosVivienda.material_techos)
          }

          if (datosVivienda.material_pisos) {
            camposCompletos++
            console.log('✅ Material de pisos:', datosVivienda.material_pisos)
          }

          if (datosVivienda.numero_habitaciones !== undefined && datosVivienda.numero_habitaciones > 0) {
            camposCompletos++
            console.log('✅ N° habitaciones:', datosVivienda.numero_habitaciones)
          }
        }
      } catch (error) {
        console.error('❌ Error al procesar datos_vivienda:', error)
      }
    } else {
      console.log('❌ No hay datos de vivienda')
    }

    // Evaluar datos de educación
    if (data.datos_educacion) {
      console.log('🎓 Evaluando datos_educacion:', JSON.stringify(data.datos_educacion, null, 2))

      try {
        const datosEducacion = typeof data.datos_educacion === 'string'
          ? JSON.parse(data.datos_educacion)
          : data.datos_educacion

        if (datosEducacion) {
          if (datosEducacion.nivel_educativo) {
            camposCompletos++
            console.log('✅ Nivel educativo:', datosEducacion.nivel_educativo)
          }

          if (datosEducacion.estado_educativo) {
            camposCompletos++
            console.log('✅ Estado educativo:', datosEducacion.estado_educativo)
          }

          if (datosEducacion.centro_educativo) {
            camposCompletos++
            console.log('✅ Centro educativo:', datosEducacion.centro_educativo)
          }

          if (datosEducacion.año_lectivo !== undefined) {
            camposCompletos++
            console.log('✅ Año lectivo:', datosEducacion.año_lectivo)
          }

          if (datosEducacion.grado !== undefined) {
            camposCompletos++
            console.log('✅ Grado:', datosEducacion.grado)
          }
        }
      } catch (error) {
        console.error('❌ Error al procesar datos_educacion:', error)
      }
    } else {
      console.log('❌ No hay datos de educación')
    }

    const totalCamposPosibles = camposRequeridos.length + 25 // Aumentado para contar todos los campos posibles
    const porcentaje = Math.round((camposCompletos / totalCamposPosibles) * 100)

    console.log('🎯 RESULTADO FINAL DEL CÁLCULO:', {
      id: data.id,
      camposCompletos,
      totalCamposPosibles,
      porcentajeCalculado: porcentaje,
      calculado: Math.min(porcentaje, 100)
    })

    return Math.min(porcentaje, 100)
  }

  private calculateAge(fechaNacimiento: Date | string): number {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}