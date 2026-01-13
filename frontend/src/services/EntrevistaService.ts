// services/EntrevistaService.ts
// Single Responsibility: Operaciones CRUD de Entrevistas

import apiClient from '@/lib/api'
import type { EntrevistaAplicada } from '@/types'

export interface CreateEntrevistaData {
  ficha_social_id?: string
  estudiante_id?: string
  estudiante_nombres: string
  estudiante_apellidos: string
  estudiante_edad?: number
  estudiante_fecha_nacimiento?: string
  aula?: string
  grado?: string
  respuestas?: any
  estado?: string
  porcentaje_completado?: number
}

export interface UpdateEntrevistaData extends Partial<CreateEntrevistaData> {}

export interface EntrevistasResponse {
  data: EntrevistaAplicada[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class EntrevistaService {
  // Listar todas las entrevistas con filtros opcionales
  static async getEntrevistas(filtros?: {
    estudiante_nombres?: string
    estudiante_apellidos?: string
    grado?: string
    aula?: string
    estado?: string
    page?: number
    limit?: number
  }): Promise<EntrevistasResponse> {
    try {
      const params = new URLSearchParams()

      if (filtros?.estudiante_nombres) {
        params.append('estudiante_nombres', filtros.estudiante_nombres)
      }
      if (filtros?.estudiante_apellidos) {
        params.append('estudiante_apellidos', filtros.estudiante_apellidos)
      }
      if (filtros?.grado) {
        params.append('grado', filtros.grado)
      }
      if (filtros?.aula) {
        params.append('aula', filtros.aula)
      }
      if (filtros?.estado) {
        params.append('estado', filtros.estado)
      }
      if (filtros?.page) {
        params.append('page', filtros.page.toString())
      }
      if (filtros?.limit) {
        params.append('limit', filtros.limit.toString())
      }

      const response = await apiClient.get<EntrevistasResponse>(
        `/api/v1/entrevistas?${params.toString()}`
      )

      if (response.success && response.data) {
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
      console.error('Error al cargar entrevistas:', error)
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

  // Obtener una entrevista por ID
  static async getEntrevistaById(id: string): Promise<EntrevistaAplicada> {
    const response = await apiClient.get<{ entrevista: EntrevistaAplicada }>(
      `/api/v1/entrevistas/${id}`
    )

    if (response.success && response.data) {
      return response.data.entrevista || response.data
    }

    const errorMsg = response.error?.message || 'Entrevista no encontrada'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear nueva entrevista
  static async createEntrevista(data: CreateEntrevistaData): Promise<EntrevistaAplicada> {
    const response = await apiClient.post<{ entrevista: EntrevistaAplicada }>(
      '/api/v1/entrevistas',
      data
    )

    if (response.success && response.data) {
      return response.data.entrevista || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear la entrevista'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar entrevista existente
  static async updateEntrevista(
    id: string,
    data: UpdateEntrevistaData
  ): Promise<EntrevistaAplicada> {
    const response = await apiClient.put<{ entrevista: EntrevistaAplicada }>(
      `/api/v1/entrevistas/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.entrevista || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar la entrevista'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar entrevista
  static async deleteEntrevista(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/entrevistas/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar la entrevista'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
