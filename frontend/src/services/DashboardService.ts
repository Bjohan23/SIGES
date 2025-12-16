// services/DashboardService.ts
// Single Responsibility: Obtener estadísticas del dashboard

import apiClient from '@/lib/api'
import type { Estadisticas } from '@/types'

export class DashboardService {
  // Obtener estadísticas generales
  static async getEstadisticas(): Promise<Estadisticas> {
    try {
      const response = await apiClient.get<Estadisticas>('/dashboard/statistics')

      if (response.success && response.data) {
        return response.data
      }

      // Valores por defecto si no hay datos
      return {
        total_fichas: 0,
        fichas_completas: 0,
        fichas_pendientes: 0,
        familias_disfuncionales: 0,
        total_entrevistas: 0,
        entrevistas_completas: 0,
        usuarios_activos: 0,
      }
    } catch (error) {
      // En caso de error, retornar valores por defecto
      return {
        total_fichas: 0,
        fichas_completas: 0,
        fichas_pendientes: 0,
        familias_disfuncionales: 0,
        total_entrevistas: 0,
        entrevistas_completas: 0,
        usuarios_activos: 0,
      }
    }
  }

  // Obtener estadísticas detalladas por período
  static async getEstadisticasPorPeriodo(periodo: 'semana' | 'mes' | 'año'): Promise<any> {
    try {
      const response = await apiClient.get<any>(`/dashboard/statistics/${periodo}`)

      if (response.success && response.data) {
        return response.data
      }

      return null
    } catch (error) {
      return null
    }
  }

  // Obtener métricas en tiempo real
  static async getMetricasTiempoReal(): Promise<any> {
    try {
      const response = await apiClient.get<any>('/dashboard/real-time-metrics')

      if (response.success && response.data) {
        return response.data
      }

      return null
    } catch (error) {
      return null
    }
  }
}
