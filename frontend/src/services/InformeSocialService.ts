// services/InformeSocialService.ts
// Single Responsibility: Operaciones CRUD de Informes Sociales

import apiClient from '@/lib/api'

export interface InformeSocial {
  id: string
  estudiante_id?: string
  nombres_apellidos?: string
  edad?: number
  estado_civil?: string
  grado_instruccion?: string
  direccion?: string
  motivo?: string
  situacion_familiar?: any
  situacion_economica?: any
  vivienda?: any
  educacion?: any
  problema_social?: any
  apreciacion_profesional?: string
  lugar?: string
  fecha?: string
  created_by?: string
  updated_by?: string
  created_at: string
  updated_at: string
  estudiante?: {
    id: string
    codigo: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
  }
  creador?: {
    id: string
    nombres: string
    apellidos: string
  }
}

export interface CreateInformeSocialData {
  estudiante_id?: string
  nombres_apellidos?: string
  edad?: number
  estado_civil?: string
  grado_instruccion?: string
  direccion?: string
  motivo?: string
  situacion_familiar?: any
  situacion_economica?: any
  vivienda?: any
  educacion?: any
  problema_social?: any
  apreciacion_profesional?: string
  lugar?: string
  fecha?: string
}

export interface UpdateInformeSocialData extends Partial<CreateInformeSocialData> {}

export interface InformesSocialesResponse {
  data: InformeSocial[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class InformeSocialService {
  // Listar todos los informes sociales con filtros opcionales
  static async getInformesSociales(filtros?: {
    estudiante_id?: string
    estado?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<InformesSocialesResponse> {
    try {
      const params = new URLSearchParams()

      if (filtros?.estudiante_id) {
        params.append('estudiante_id', filtros.estudiante_id)
      }
      if (filtros?.estado) {
        params.append('estado', filtros.estado)
      }
      if (filtros?.search) {
        params.append('search', filtros.search)
      }
      if (filtros?.page) {
        params.append('page', filtros.page.toString())
      }
      if (filtros?.limit) {
        params.append('limit', filtros.limit.toString())
      }

      const response = await apiClient.get<InformesSocialesResponse>(
        `/api/v1/informes-sociales?${params.toString()}`
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
      console.error('Error al cargar informes sociales:', error)
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

  // Obtener un informe social por ID
  static async getInformeSocialById(id: string): Promise<InformeSocial> {
    const response = await apiClient.get<{ informe_social: InformeSocial }>(
      `/api/v1/informes-sociales/${id}`
    )

    if (response.success && response.data) {
      return response.data.informe_social || response.data
    }

    const errorMsg = response.error?.message || 'Informe Social no encontrado'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear nuevo informe social
  static async createInformeSocial(data: CreateInformeSocialData): Promise<InformeSocial> {
    const response = await apiClient.post<{ informe_social: InformeSocial }>(
      '/api/v1/informes-sociales',
      data
    )

    if (response.success && response.data) {
      return response.data.informe_social || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear el informe social'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar informe social existente
  static async updateInformeSocial(
    id: string,
    data: UpdateInformeSocialData
  ): Promise<InformeSocial> {
    const response = await apiClient.put<{ informe_social: InformeSocial }>(
      `/api/v1/informes-sociales/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.informe_social || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar el informe social'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar informe social
  static async deleteInformeSocial(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/informes-sociales/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar el informe social'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
