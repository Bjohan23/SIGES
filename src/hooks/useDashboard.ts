// hooks/useDashboard.ts
// Single Responsibility: Hook para manejar lógica del dashboard

import { useState, useEffect } from 'react'
import { DashboardService } from '@/services/DashboardService'
import { ErrorHandler } from '@/utils/errorHandler'
import type { Estadisticas } from '@/types'

export function useDashboard() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEstadisticas()
  }, [])

  async function loadEstadisticas() {
    try {
      setLoading(true)
      setError(null)
      const data = await DashboardService.getEstadisticas()
      setEstadisticas(data)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    estadisticas,
    loading,
    error,
    refresh: loadEstadisticas,
  }
}
