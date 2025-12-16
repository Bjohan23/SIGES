// hooks/useEntrevistas.ts
// Single Responsibility: Hook para manejar lógica de entrevistas

import { useState, useEffect } from 'react'
import { EntrevistaService } from '@/services/EntrevistaService'
import { UserService } from '@/services/UserService'
import { ErrorHandler } from '@/utils/errorHandler'
import { useAuth } from '@/context/AuthContext'
import type { EntrevistaAplicada } from '@/types'

export function useEntrevistas() {
  const { user } = useAuth()
  const [entrevistas, setEntrevistas] = useState<EntrevistaAplicada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEntrevistas()
  }, [])

  async function loadEntrevistas(filtros?: { grado?: string; estado?: string }) {
    try {
      setLoading(true)
      setError(null)
      const data = await EntrevistaService.getEntrevistas(filtros)
      setEntrevistas(data)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function createEntrevista(entrevistaData: Partial<EntrevistaAplicada>) {
    if (!user) throw new Error('Usuario no autenticado')

    try {
      const usuarioId = await UserService.getUserId(user.auth_user_id)
      const nuevaEntrevista = await EntrevistaService.createEntrevista(
        entrevistaData,
        usuarioId
      )
      setEntrevistas([nuevaEntrevista, ...entrevistas])
      return nuevaEntrevista
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  async function updateEntrevista(
    id: string,
    entrevistaData: Partial<EntrevistaAplicada>
  ) {
    if (!user) throw new Error('Usuario no autenticado')

    try {
      const usuarioId = await UserService.getUserId(user.auth_user_id)
      const entrevistaActualizada = await EntrevistaService.updateEntrevista(
        id,
        entrevistaData,
        usuarioId
      )
      setEntrevistas(
        entrevistas.map((e) => (e.id === id ? entrevistaActualizada : e))
      )
      return entrevistaActualizada
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  async function deleteEntrevista(id: string) {
    try {
      await EntrevistaService.deleteEntrevista(id)
      setEntrevistas(entrevistas.filter((e) => e.id !== id))
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  return {
    entrevistas,
    loading,
    error,
    loadEntrevistas,
    createEntrevista,
    updateEntrevista,
    deleteEntrevista,
  }
}
