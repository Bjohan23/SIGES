// services/FamiliaDisfuncionalService.ts
// Single Responsibility: Operaciones CRUD de Familias Disfuncionales

import apiClient from '@/lib/api'
import type { FamiliaDisfuncional } from '@/types'

export class FamiliaDisfuncionalService {
  // Listar todas las familias disfuncionales con filtros
  static async getFamilias(filtros?: {
    seguimiento_activo?: boolean
    page?: number
    limit?: number
  }): Promise<any[]> {
    try {
      const params = new URLSearchParams()

      if (filtros?.seguimiento_activo !== undefined) {
        params.append('seguimiento_activo', filtros.seguimiento_activo.toString())
      }
      if (filtros?.page) {
        params.append('page', filtros.page.toString())
      }
      if (filtros?.limit) {
        params.append('limit', filtros.limit.toString())
      }

      const response = await apiClient.get<any[]>(`/familias-disfuncionales?${params.toString()}`)

      if (response.success && response.data) {
        return response.data
      }

      return []
    } catch (error) {
      throw error
    }
  }

  // Obtener una familia disfuncional por ID
  static async getFamiliaById(id: string): Promise<FamiliaDisfuncional> {
    try {
      const response = await apiClient.get<FamiliaDisfuncional>(`/familias-disfuncionales/${id}`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Familia disfuncional no encontrada')
    } catch (error) {
      throw error
    }
  }

  // Marcar familia como disfuncional
  static async marcarComoDisfuncional(
    fichaId: string,
    datosEvaluacion: Partial<FamiliaDisfuncional>,
    usuarioId: string
  ): Promise<FamiliaDisfuncional> {
    try {
      const response = await apiClient.post<FamiliaDisfuncional>('/familias-disfuncionales', {
        ficha_social_id: fichaId,
        ...datosEvaluacion,
        evaluado_por: usuarioId,
      })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('No se pudo marcar la familia como disfuncional')
    } catch (error) {
      throw error
    }
  }

  // Actualizar familia disfuncional
  static async updateFamilia(
    id: string,
    familiaData: Partial<FamiliaDisfuncional>
  ): Promise<FamiliaDisfuncional> {
    try {
      const response = await apiClient.put<FamiliaDisfuncional>(`/familias-disfuncionales/${id}`, familiaData)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('No se pudo actualizar la familia disfuncional')
    } catch (error) {
      throw error
    }
  }

  // Eliminar familia disfuncional
  static async deleteFamilia(id: string): Promise<void> {
    try {
      await apiClient.delete(`/familias-disfuncionales/${id}`)
    } catch (error) {
      throw error
    }
  }
}
