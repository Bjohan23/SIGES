// services/SituacionSocioFamiliarService.ts
// Single Responsibility: Operaciones CRUD de Situaciones Socio Familiares

import apiClient from '@/lib/api'

export interface SituacionSocioFamiliar {
  id: string
  subsistema_conyugal?: string
  subsistema_paterno_fiscal?: string
  subsistema_fraternal?: string
  solidaridad_familiar?: string
  relaciones?: string
  desempeno_roles?: string
  relaciones_crianza?: string
  relaciones_exogrupo?: string
  pautas_vida_familiar?: string
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

export interface CreateSituacionSocioFamiliarData {
  subsistema_conyugal?: string
  subsistema_paterno_fiscal?: string
  subsistema_fraternal?: string
  solidaridad_familiar?: string
  relaciones?: string
  desempeno_roles?: string
  relaciones_crianza?: string
  relaciones_exogrupo?: string
  pautas_vida_familiar?: string
}

export interface UpdateSituacionSocioFamiliarData extends Partial<CreateSituacionSocioFamiliarData> {}

export interface SituacionesSocioFamiliaresResponse {
  data: SituacionSocioFamiliar[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class SituacionSocioFamiliarService {
  // Obtener todas las situaciones socio familiares con paginación y filtros
  static async getSituacionesSocioFamiliares(
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<SituacionesSocioFamiliaresResponse> {
    const response = await apiClient.get<SituacionSocioFamiliar[]>('/api/v1/situaciones-socio-familiares', {
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

    const errorMsg = response.error?.message || 'No se pudieron obtener las situaciones socio familiares'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Obtener una situación socio familiar por ID
  static async getSituacionSocioFamiliarById(id: string): Promise<SituacionSocioFamiliar> {
    const response = await apiClient.get<{ situacion_socio_familiar: SituacionSocioFamiliar }>(
      `/api/v1/situaciones-socio-familiares/${id}`
    )

    if (response.success && response.data) {
      return response.data.situacion_socio_familiar || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo obtener la situación socio familiar'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear una nueva situación socio familiar
  static async createSituacionSocioFamiliar(
    data: CreateSituacionSocioFamiliarData
  ): Promise<SituacionSocioFamiliar> {
    const response = await apiClient.post<{ situacion_socio_familiar: SituacionSocioFamiliar }>(
      '/api/v1/situaciones-socio-familiares',
      data
    )

    if (response.success && response.data) {
      return response.data.situacion_socio_familiar || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear la situación socio familiar'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar una situación socio familiar
  static async updateSituacionSocioFamiliar(
    id: string,
    data: UpdateSituacionSocioFamiliarData
  ): Promise<SituacionSocioFamiliar> {
    const response = await apiClient.put<{ situacion_socio_familiar: SituacionSocioFamiliar }>(
      `/api/v1/situaciones-socio-familiares/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.situacion_socio_familiar || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar la situación socio familiar'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar una situación socio familiar
  static async deleteSituacionSocioFamiliar(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/situaciones-socio-familiares/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar la situación socio familiar'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
