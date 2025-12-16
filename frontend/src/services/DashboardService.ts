// services/DashboardService.ts
// Single Responsibility: Obtener estadísticas del dashboard

import { supabase } from '@/lib/supabase'
import type { Estadisticas } from '@/types'

export class DashboardService {
  // Obtener estadísticas generales
  static async getEstadisticas(): Promise<Estadisticas> {
    const { data, error } = await supabase
      .from('vista_estadisticas_dashboard')
      .select('*')
      .single()

    if (error) throw error
    if (!data) {
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
    }

    return data as Estadisticas
  }
}
