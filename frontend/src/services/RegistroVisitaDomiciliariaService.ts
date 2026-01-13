// services/RegistroVisitaDomiciliariaService.ts
// Single Responsibility: Operaciones CRUD de Registros de Visita Domiciliaria

import apiClient from '@/lib/api'

export interface RegistroVisitaDomiciliaria {
  id: string
  nombre_entrevistado?: string
  domicilio?: string
  fecha_visita?: string
  responsable?: string
  objetivo?: string
  relato?: string
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

export interface CreateRegistroVisitaDomiciliariaData {
  nombre_entrevistado?: string
  domicilio?: string
  fecha_visita?: string
  responsable?: string
  objetivo?: string
  relato?: string
}

export interface UpdateRegistroVisitaDomiciliariaData extends Partial<CreateRegistroVisitaDomiciliariaData> {}

export interface RegistrosVisitasDomiciliariasResponse {
  data: RegistroVisitaDomiciliaria[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class RegistroVisitaDomiciliariaService {
  // Obtener todos los registros de visita domiciliaria con paginación y filtros
  static async getRegistrosVisitasDomiciliarias(
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<RegistrosVisitasDomiciliariasResponse> {
    // The API returns { success: true, data: [...], pagination: {...}, timestamp: "..." }
    const response = await apiClient.get<RegistroVisitaDomiciliaria[]>('/api/v1/registros-visitas-domiciliarias', {
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

    const errorMsg = response.error?.message || 'No se pudieron obtener los registros de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Obtener un registro de visita domiciliaria por ID
  static async getRegistroVisitaDomiciliariaById(id: string): Promise<RegistroVisitaDomiciliaria> {
    const response = await apiClient.get<{ registro_visita_domiciliaria: RegistroVisitaDomiciliaria }>(
      `/api/v1/registros-visitas-domiciliarias/${id}`
    )

    if (response.success && response.data) {
      return response.data.registro_visita_domiciliaria || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo obtener el registro de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear un nuevo registro de visita domiciliaria
  static async createRegistroVisitaDomiciliaria(
    data: CreateRegistroVisitaDomiciliariaData
  ): Promise<RegistroVisitaDomiciliaria> {
    const response = await apiClient.post<{ registro_visita_domiciliaria: RegistroVisitaDomiciliaria }>(
      '/api/v1/registros-visitas-domiciliarias',
      data
    )

    if (response.success && response.data) {
      return response.data.registro_visita_domiciliaria || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear el registro de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar un registro de visita domiciliaria
  static async updateRegistroVisitaDomiciliaria(
    id: string,
    data: UpdateRegistroVisitaDomiciliariaData
  ): Promise<RegistroVisitaDomiciliaria> {
    const response = await apiClient.put<{ registro_visita_domiciliaria: RegistroVisitaDomiciliaria }>(
      `/api/v1/registros-visitas-domiciliarias/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.registro_visita_domiciliaria || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar el registro de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar un registro de visita domiciliaria
  static async deleteRegistroVisitaDomiciliaria(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/registros-visitas-domiciliarias/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar el registro de visita domiciliaria'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
