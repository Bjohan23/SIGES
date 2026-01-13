// services/InformeVisitaDomiciliariaService.ts
// Single Responsibility: Operaciones CRUD de Informes de Visita Domiciliaria

import apiClient from '@/lib/api'

export interface InformeVisitaDomiciliaria {
  id: string
  nombres_apellidos?: string
  direccion?: string
  motivo?: string
  objetivos?: string
  narracion?: string
  conclusiones?: string
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

export interface CreateInformeVisitaDomiciliariaData {
  nombres_apellidos?: string
  direccion?: string
  motivo?: string
  objetivos?: string
  narracion?: string
  conclusiones?: string
}

export interface UpdateInformeVisitaDomiciliariaData extends Partial<CreateInformeVisitaDomiciliariaData> {}

export interface InformesVisitasDomiciliariasResponse {
  data: InformeVisitaDomiciliaria[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class InformeVisitaDomiciliariaService {
  // Obtener todos los informes de visita domiciliaria con paginación y filtros
  static async getInformesVisitasDomiciliarias(
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<InformesVisitasDomiciliariasResponse> {
    // The API returns { success: true, data: [...], pagination: {...}, timestamp: "..." }
    const response = await apiClient.get<InformeVisitaDomiciliaria[]>('/api/v1/informes-visitas-domiciliarias', {
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

    const errorMsg = response.error?.message || 'No se pudieron obtener los informes de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Obtener un informe de visita domiciliaria por ID
  static async getInformeVisitaDomiciliariaById(id: string): Promise<InformeVisitaDomiciliaria> {
    const response = await apiClient.get<{ informe_visita_domiciliaria: InformeVisitaDomiciliaria }>(
      `/api/v1/informes-visitas-domiciliarias/${id}`
    )

    if (response.success && response.data) {
      return response.data.informe_visita_domiciliaria || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo obtener el informe de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 404
    error.response = response
    throw error
  }

  // Crear un nuevo informe de visita domiciliaria
  static async createInformeVisitaDomiciliaria(
    data: CreateInformeVisitaDomiciliariaData
  ): Promise<InformeVisitaDomiciliaria> {
    const response = await apiClient.post<{ informe_visita_domiciliaria: InformeVisitaDomiciliaria }>(
      '/api/v1/informes-visitas-domiciliarias',
      data
    )

    if (response.success && response.data) {
      return response.data.informe_visita_domiciliaria || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo crear el informe de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Actualizar un informe de visita domiciliaria
  static async updateInformeVisitaDomiciliaria(
    id: string,
    data: UpdateInformeVisitaDomiciliariaData
  ): Promise<InformeVisitaDomiciliaria> {
    const response = await apiClient.put<{ informe_visita_domiciliaria: InformeVisitaDomiciliaria }>(
      `/api/v1/informes-visitas-domiciliarias/${id}`,
      data
    )

    if (response.success && response.data) {
      return response.data.informe_visita_domiciliaria || response.data
    }

    const errorMsg = response.error?.message || 'No se pudo actualizar el informe de visita domiciliaria'
    const error: any = new Error(errorMsg)
    error.status = response.error?.statusCode || 400
    error.response = response
    throw error
  }

  // Eliminar un informe de visita domiciliaria
  static async deleteInformeVisitaDomiciliaria(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/informes-visitas-domiciliarias/${id}`)

    if (!response.success) {
      const errorMsg = response.error?.message || 'No se pudo eliminar el informe de visita domiciliaria'
      const error: any = new Error(errorMsg)
      error.status = response.error?.statusCode || 400
      error.response = response
      throw error
    }
  }
}
