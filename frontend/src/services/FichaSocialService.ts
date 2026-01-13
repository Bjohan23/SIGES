// services/FichaSocialService.ts
// Single Responsibility: Operaciones CRUD de Fichas Sociales

import apiClient from '@/lib/api'
import type { FichaSocial } from '@/types'

export class FichaSocialService {
  // Listar todas las fichas con filtros opcionales
  static async getFichas(filtros?: {
    apellidos?: string
    estado?: string
    distrito?: string
    page?: number
    limit?: number
  }): Promise<FichaSocial[]> {
    try {
      const params = new URLSearchParams()

      if (filtros?.apellidos) {
        params.append('apellidos', filtros.apellidos)
      }
      if (filtros?.estado) {
        params.append('estado', filtros.estado)
      }
      if (filtros?.distrito) {
        params.append('distrito', filtros.distrito)
      }
      if (filtros?.page) {
        params.append('page', filtros.page.toString())
      }
      if (filtros?.limit) {
        params.append('limit', filtros.limit.toString())
      }

      const response = await apiClient.get<FichaSocial[]>(`/api/v1/fichas-sociales?${params.toString()}`)

      if (response.success && response.data) {
        // El backend devuelve {fichas: [], pagination: {}}
        return Array.isArray(response.data) ? response.data : response.data.fichas || []
      }

      return []
    } catch (error) {
      throw error
    }
  }

  // Obtener una ficha por ID
  static async getFichaById(id: string): Promise<FichaSocial> {
    try {
      const response = await apiClient.get<any>(`/api/v1/fichas-sociales/${id}`)

      if (response.success && response.data) {
        // La API devuelve { success: true, data: { ficha: {...} } }
        return response.data.ficha || response.data
      }

      throw new Error('Ficha no encontrada')
    } catch (error) {
      throw error
    }
  }

  // Calcular porcentaje de completado
  private static calcularPorcentajeCompletado(fichaData: Partial<FichaSocial>): number {
    let completedFields = 0
    let totalFields = 32 // Total de campos obligatorios

    // Datos del estudiante (11 campos)
    if (fichaData.apellido_paterno) completedFields++
    if (fichaData.apellido_materno) completedFields++
    if (fichaData.nombres) completedFields++
    if (fichaData.sexo) completedFields++
    if (fichaData.fecha_nacimiento) completedFields++
    if (fichaData.nacionalidad) completedFields++
    if (fichaData.nacionalidad === 'Peruana' ? fichaData.dni : fichaData.carne_extranjeria) completedFields++
    if (fichaData.grado) completedFields++
    if (fichaData.seccion) completedFields++
    if (fichaData.domicilio_actual) completedFields++
    if (fichaData.distrito) completedFields++

    // Composición familiar (12 campos)
    if (fichaData.composicion_familiar) {
      const { padre, madre } = fichaData.composicion_familiar
      if (padre?.apellido_paterno) completedFields++
      if (padre?.apellido_materno) completedFields++
      if (padre?.nombres) completedFields++
      if (padre?.edad) completedFields++
      if (padre?.ocupacion) completedFields++
      if (padre?.celular) completedFields++
      if (madre?.apellido_paterno) completedFields++
      if (madre?.apellido_materno) completedFields++
      if (madre?.nombres) completedFields++
      if (madre?.edad) completedFields++
      if (madre?.ocupacion) completedFields++
      if (madre?.celular) completedFields++
    }

    // Situación económica (3 campos - al menos un ingreso)
    if (fichaData.datos_economicos) {
      const hasIncome = (fichaData.datos_economicos.ingresos.trabajador || 0) > 0 ||
                       (fichaData.datos_economicos.ingresos.conyuge || 0) > 0 ||
                       (fichaData.datos_economicos.ingresos.otros || 0) > 0
      if (hasIncome) completedFields += 3
    }

    // Vivienda y salud (3 campos)
    if (fichaData.datos_vivienda?.tipo_vivienda) completedFields++
    if (fichaData.datos_salud?.tipo_seguro) completedFields++
    if (fichaData.datos_salud?.grupo_sanguineo) completedFields++

    // Declaración jurada (3 campos)
    if (fichaData.declaracion_jurada?.acepta_terminos) completedFields++
    if (fichaData.declaracion_jurada?.nombre_firmante) completedFields++
    if (fichaData.declaracion_jurada?.firma_digital) completedFields++

    return Math.round((completedFields / totalFields) * 100)
  }

  // Crear nueva ficha
  static async createFicha(
    fichaData: Partial<FichaSocial>,
    usuarioId: string
  ): Promise<FichaSocial> {
    // Calcular porcentaje de completado
    const porcentaje = this.calcularPorcentajeCompletado(fichaData)

    // Construir apellidos completo para compatibilidad
    const apellidos = `${fichaData.apellido_paterno || ''} ${fichaData.apellido_materno || ''}`.trim()

    // Determinar estado según porcentaje
    const estado = porcentaje === 100 ? 'completa' : 'incompleta'

    // Normalizar estado_civil a mayúsculas para compatibilidad con backend
    const estadoCivilNormalizado = fichaData.estado_civil?.toUpperCase()

    const response = await apiClient.post<FichaSocial>('/api/v1/fichas-sociales', {
      ...fichaData,
      apellidos,
      porcentaje_completado: porcentaje,
      estado,
      estado_civil: estadoCivilNormalizado, // Usar el valor normalizado
      created_by: usuarioId,
      updated_by: usuarioId,
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error('No se pudo crear la ficha')
  }

  // Actualizar ficha existente
  static async updateFicha(
    id: string,
    fichaData: Partial<FichaSocial>,
    usuarioId: string
  ): Promise<FichaSocial> {
    // Calcular porcentaje de completado
    const porcentaje = this.calcularPorcentajeCompletado(fichaData)

    // Construir apellidos completo para compatibilidad
    const apellidos = `${fichaData.apellido_paterno || ''} ${fichaData.apellido_materno || ''}`.trim()

    // Determinar estado según porcentaje
    const estado = porcentaje === 100 ? 'completa' : 'incompleta'

    // Normalizar estado_civil a mayúsculas para compatibilidad con backend
    const estadoCivilNormalizado = fichaData.estado_civil?.toUpperCase()

    // Construir apellidos completo para el backend
    const apellidosCompletos = `${fichaData.apellido_paterno || ''} ${fichaData.apellido_materno || ''}`.trim();

    // Limpiar los datos para enviar solo los campos que el backend espera
    const cleanedData: any = {
      apellidos: apellidosCompletos,
      nombres: fichaData.nombres,
      sexo: fichaData.sexo,
      fecha_nacimiento: fichaData.fecha_nacimiento,
      nacionalidad: fichaData.nacionalidad,
      dni: fichaData.dni,
      carne_extranjeria: fichaData.carne_extranjeria,
      nivel_educativo: fichaData.nivel_educativo,
      estado_civil: estadoCivilNormalizado,
      num_hijos: fichaData.num_hijos,
      domicilio_actual: fichaData.domicilio_actual,
      distrito: fichaData.distrito,
      composicion_familiar: fichaData.composicion_familiar,
      datos_economicos: fichaData.datos_economicos,
      datos_vivienda: fichaData.datos_vivienda,
      datos_salud: fichaData.datos_salud,
      declaracion_jurada: fichaData.declaracion_jurada,
      updated_by: usuarioId,
    };

    // Eliminar campos undefined o null
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === undefined || cleanedData[key] === null) {
        delete cleanedData[key];
      }
    });

    const response = await apiClient.put<FichaSocial>(`/api/v1/fichas-sociales/${id}`, cleanedData);

    if (response.success && response.data) {
      return response.data
    }

    throw new Error('No se pudo actualizar la ficha')
  }

  // Eliminar ficha
  static async deleteFicha(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/fichas-sociales/${id}`)
    } catch (error) {
      throw error
    }
  }
}
