// hooks/useFamiliasDisfuncionales.ts
// Single Responsibility: Hook para manejar lógica de familias disfuncionales

import { useState, useEffect } from 'react'
import { FamiliaDisfuncionalService } from '@/services/FamiliaDisfuncionalService'
import { UserService } from '@/services/UserService'
import { ErrorHandler } from '@/utils/errorHandler'
import { useAuth } from '@/context/AuthContext'
import type { FamiliaDisfuncional } from '@/types'

export function useFamiliasDisfuncionales() {
  const { user } = useAuth()
  const [familias, setFamilias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFamilias()
  }, [])

  async function loadFamilias(filtros?: { seguimiento_activo?: boolean }) {
    try {
      setLoading(true)
      setError(null)
      const data = await FamiliaDisfuncionalService.getFamilias(filtros)
      setFamilias(data)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function marcarComoDisfuncional(
    fichaId: string,
    datosEvaluacion: Partial<FamiliaDisfuncional>
  ) {
    if (!user) throw new Error('Usuario no autenticado')

    try {
      const usuarioId = await UserService.getUserId(user.auth_user_id)
      const nuevaFamilia =
        await FamiliaDisfuncionalService.marcarComoDisfuncional(
          fichaId,
          datosEvaluacion,
          usuarioId
        )
      await loadFamilias()
      return nuevaFamilia
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      throw new Error(errorMessage)
    }
  }

  async function updateFamilia(
    id: string,
    familiaData: Partial<FamiliaDisfuncional>
  ) {
    try {
      const familiaActualizada =
        await FamiliaDisfuncionalService.updateFamilia(id, familiaData)
      setFamilias(
        familias.map((f) => (f.id === id ? { ...f, ...familiaActualizada } : f))
      )
      return familiaActualizada
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      throw new Error(errorMessage)
    }
  }

  async function deleteFamilia(id: string) {
    try {
      await FamiliaDisfuncionalService.deleteFamilia(id)
      setFamilias(familias.filter((f) => f.id !== id))
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      throw new Error(errorMessage)
    }
  }

  return {
    familias,
    loading,
    error,
    loadFamilias,
    marcarComoDisfuncional,
    updateFamilia,
    deleteFamilia,
  }
}
