// services/RegistroEntrevistaService.ts
// Single Responsibility: Operaciones CRUD de Registros de Entrevista

import apiClient from '@/lib/api'

export interface RegistroEntrevista {
  id: string
  lugar?: string
  fecha?: string
  hora?: string
  tema?: string
  objetivo?: string
  entrevistado?: string
  entrevistador?: string
  descripcion_relato?: string
  created_by?: string
  updated_by?: string
  created_at: string
  updated_at: string
  creador?: {
    id: string
    nombres: string
    apellidos: string
  }
}

export interface CreateRegistroEntrevistaData {
  lugar?: string
  fecha?: string
  hora?: string
  tema?: string
  objetivo?: string
  entrevistado?: string
  entrevistador?: string
  descripcion_relato?: string
}

export interface UpdateRegistroEntrevistaData extends Partial<CreateRegistroEntrevistaData> {}

export interface RegistrosEntrevistasResponse {
  data: RegistroEntrevista[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class RegistroEntrevistaService {
  // Obtener todos los registros de entrevista con paginación y filtros
  static async getRegistrosEntrevistas(
    params?: { page?: number; limit?: number; estudiante_id?: string; search?: string }
  ): Promise<RegistrosEntrevistasResponse> {
    // The API returns { success: true, data: [...], pagination: {...}, timestamp: "..." }
    const response = await apiClient.get<RegistroEntrevista[]>('/api/v1/registros-entrevistas', {
      params,
    }) as any

    if (response.success && response.data) {
      // Extract data and pagination from the response
      return {
        data: response.data,
        pagination: response.pagination,
      }
    }

    // Si la respuesta es exitosa pero no tiene datos, devolver estructura vacía
    if (response.success) {
      return {
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }

    const errorMsg = response.error?.message || 'No se pudieron obtener los registros de entrevista'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Obtener un registro de entrevista por ID
  static async getRegistroEntrevistaById(id: string): Promise<RegistroEntrevista> {
    const response = await apiClient.get<{ registro_entrevista: RegistroEntrevista }>(
      `/api/v1/registros-entrevistas/${id}`
    )

    if (response.success && response.data) {
      return response.data.registro_entrevista || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo obtener el registro de entrevista'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear un nuevo registro de entrevista
  static async createRegistroEntrevista(
    data: CreateRegistroEntrevistaData
  ): Promise<RegistroEntrevista> {
    const response = await apiClient.post<{ registro_entrevista: RegistroEntrevista }>(
      '/api/v1/registros-entrevistas',
      data
    )

    if (response.success && response.data) {
      return response.data.registro_entrevista || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear el registro de entrevista'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar un registro de entrevista
  static async updateRegistroEntrevista(
    id: string,
    data: UpdateRegistroEntrevistaData
  ): Promise<RegistroEntrevista> {
    const response = await apiClient.put<{ registro_entrevista: RegistroEntrevista }>(
      `/api/v1/registros-entrevistas/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.registro_entrevista || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar el registro de entrevista'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar un registro de entrevista
  static async deleteRegistroEntrevista(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/registros-entrevistas/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar el registro de entrevista'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
