// services/EntrevistaService.ts
// Single Responsibility: Operaciones CRUD de Entrevistas

import apiClient from '@/lib/api'
import type { EntrevistaAplicada } from '@/types'

export class EntrevistaService {
  // Listar todas las entrevistas con filtros opcionales
  static async getEntrevistas(filtros?: {
    grado?: string
    estado?: string
    page?: number
    limit?: number
  }): Promise<EntrevistaAplicada[]> {
    try {
      const params = new URLSearchParams()

      if (filtros?.grado) {
        params.append('grado', filtros.grado)
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

      const response = await apiClient.get<EntrevistaAplicada[]>(`/entrevistas?${params.toString()}`)

      if (response.success && response.data) {
        return response.data
      }

      return []
    } catch (error) {
      throw error
    }
  }

  // Obtener una entrevista por ID
  static async getEntrevistaById(id: string): Promise<EntrevistaAplicada> {
    try {
      const response = await apiClient.get<EntrevistaAplicada>(`/entrevistas/${id}`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Entrevista no encontrada')
    } catch (error) {
      throw error
    }
  }

  // Crear nueva entrevista
  static async createEntrevista(
    entrevistaData: Partial<EntrevistaAplicada>,
    usuarioId: string
  ): Promise<EntrevistaAplicada> {
    try {
      const response = await apiClient.post<EntrevistaAplicada>('/entrevistas', {
        ...entrevistaData,
        created_by: usuarioId,
        updated_by: usuarioId,
      })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('No se pudo crear la entrevista')
    } catch (error) {
      throw error
    }
  }

  // Actualizar entrevista existente
  static async updateEntrevista(
    id: string,
    entrevistaData: Partial<EntrevistaAplicada>,
    usuarioId: string
  ): Promise<EntrevistaAplicada> {
    try {
      const response = await apiClient.put<EntrevistaAplicada>(`/entrevistas/${id}`, {
        ...entrevistaData,
        updated_by: usuarioId,
      })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('No se pudo actualizar la entrevista')
    } catch (error) {
      throw error
    }
  }

  // Eliminar entrevista
  static async deleteEntrevista(id: string): Promise<void> {
    try {
      await apiClient.delete(`/entrevistas/${id}`)
    } catch (error) {
      throw error
    }
  }
}
