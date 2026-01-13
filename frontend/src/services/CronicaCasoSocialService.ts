// services/CronicaCasoSocialService.ts
// Single Responsibility: Operaciones CRUD de Crónicas de Caso Social

import apiClient from '@/lib/api'

export interface CronicaCasoSocial {
  id: string
  nombres_apellidos?: string
  num_reunion?: number
  fecha_hora?: string
  asistentes?: string
  actividades_realizadas?: string
  programas?: string
  relato?: string
  interpretacion?: string
  sugerencias?: string
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

export interface CreateCronicaCasoSocialData {
  nombres_apellidos?: string
  num_reunion?: number
  fecha_hora?: string
  asistentes?: string
  actividades_realizadas?: string
  programas?: string
  relato?: string
  interpretacion?: string
  sugerencias?: string
}

export interface UpdateCronicaCasoSocialData extends Partial<CreateCronicaCasoSocialData> {}

export interface CronicasCasosSocialesResponse {
  data: CronicaCasoSocial[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class CronicaCasoSocialService {
  // Obtener todas las crónicas de caso social con paginación y filtros
  static async getCronicasCasosSociales(
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<CronicasCasosSocialesResponse> {
    const response = await apiClient.get<CronicaCasoSocial[]>('/api/v1/cronicas-casos-sociales', {
      params,
    }) as any

    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination,
      }
    }

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

    const errorMsg = response.error?.message || 'No se pudieron obtener las crónicas de caso social'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Obtener una crónica de caso social por ID
  static async getCronicaCasoSocialById(id: string): Promise<CronicaCasoSocial> {
    const response = await apiClient.get<{ cronica_caso_social: CronicaCasoSocial }>(
      `/api/v1/cronicas-casos-sociales/${id}`
    )

    if (response.success && response.data) {
      return response.data.cronica_caso_social || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo obtener la crónica de caso social'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear una nueva crónica de caso social
  static async createCronicaCasoSocial(
    data: CreateCronicaCasoSocialData
  ): Promise<CronicaCasoSocial> {
    const response = await apiClient.post<{ cronica_caso_social: CronicaCasoSocial }>(
      '/api/v1/cronicas-casos-sociales',
      data
    )

    if (response.success && response.data) {
      return response.data.cronica_caso_social || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear la crónica de caso social'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar una crónica de caso social
  static async updateCronicaCasoSocial(
    id: string,
    data: UpdateCronicaCasoSocialData
  ): Promise<CronicaCasoSocial> {
    const response = await apiClient.put<{ cronica_caso_social: CronicaCasoSocial }>(
      `/api/v1/cronicas-casos-sociales/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.cronica_caso_social || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar la crónica de caso social'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar una crónica de caso social
  static async deleteCronicaCasoSocial(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/cronicas-casos-sociales/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar la crónica de caso social'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
