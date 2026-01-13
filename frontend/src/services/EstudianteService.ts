// services/EstudianteService.ts
// Single Responsibility: Operaciones CRUD de Estudiantes

import apiClient from '@/lib/api'
import type { Estudiante, CreateEstudianteData, UpdateEstudianteData } from '@/types'

export interface EstudiantesResponse {
  data: Estudiante[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class EstudianteService {
  // Listar todos los estudiantes con filtros opcionales
  static async getEstudiantes(filtros?: {
    codigo?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    dni?: string
    activo?: boolean
    page?: number
    limit?: number
  }): Promise<EstudiantesResponse> {
    try {
      const params = new URLSearchParams()

      if (filtros?.codigo) {
        params.append('codigo', filtros.codigo)
      }
      if (filtros?.nombres) {
        params.append('nombres', filtros.nombres)
      }
      if (filtros?.apellido_paterno) {
        params.append('apellido_paterno', filtros.apellido_paterno)
      }
      if (filtros?.apellido_materno) {
        params.append('apellido_materno', filtros.apellido_materno)
      }
      if (filtros?.dni) {
        params.append('dni', filtros.dni)
      }
      if (filtros?.activo !== undefined) {
        params.append('activo', filtros.activo.toString())
      }
      if (filtros?.page) {
        params.append('page', filtros.page.toString())
      }
      if (filtros?.limit) {
        params.append('limit', filtros.limit.toString())
      }

      const response = await apiClient.get<EstudiantesResponse>(
        `/api/v1/estudiantes?${params.toString()}`
      )

      if (response.success && response.data) {
        // Asegurar que data siempre sea un array
        return {
          data: Array.isArray(response.data) ? response.data : (response.data?.data || []),
          pagination: response.data?.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          }
        }
      }

      // Respuesta por defecto si no hay éxito
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    } catch (error) {
      // En caso de error, retornar estructura válida vacía en lugar de lanzar
      console.error('Error al cargar estudiantes:', error)
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }
  }

  // Buscar estudiantes por nombre o apellido
  static async searchEstudiantes(query: string): Promise<Estudiante[]> {
    try {
      const response = await apiClient.get<{ estudiantes: Estudiante[] }>(
        `/api/v1/estudiantes/search/${encodeURIComponent(query)}`
      )

      if (response.success && response.data) {
        return response.data.estudiantes || []
      }

      return []
    } catch (error) {
      throw error
    }
  }

  // Obtener un estudiante por ID
  static async getEstudianteById(id: string): Promise<Estudiante> {
    const response = await apiClient.get<{ estudiante: Estudiante }>(
      `/api/v1/estudiantes/${id}`
    )

    if (response.success && response.data) {
      return response.data.estudiante || response.data
    }

    // Lanzar error con el mensaje del backend
    const errorMsg = response.error?.message || 'Estudiante no encontrado'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear nuevo estudiante
  static async createEstudiante(
    data: CreateEstudianteData
  ): Promise<Estudiante> {
    const response = await apiClient.post<{ estudiante: Estudiante }>(
      '/api/v1/estudiantes',
      data
    )

    if (response.success && response.data) {
      return response.data.estudiante || response.data
    }

    // Lanzar error con el mensaje del backend
    const errorMsg = response.error?.message || 'No se pudo crear el estudiante'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar estudiante existente
  static async updateEstudiante(
    id: string,
    data: UpdateEstudianteData
  ): Promise<Estudiante> {
    const response = await apiClient.put<{ estudiante: Estudiante }>(
      `/api/v1/estudiantes/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.estudiante || response.data
    }

    // Lanzar error con el mensaje del backend
    const errorMsg = response.error?.message || 'No se pudo actualizar el estudiante'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar estudiante (soft delete)
  static async deleteEstudiante(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/estudiantes/${id}`)

    if (!response.success) {
      // Lanzar error con el mensaje del backend
      const errorMsg = response.error?.message || 'No se pudo eliminar el estudiante'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
