// hooks/useFichasSociales.ts
// Single Responsibility: Hook para manejar lógica de fichas sociales

import { useState, useEffect } from 'react'
import { FichaSocialService } from '@/services/FichaSocialService'
import { UserService } from '@/services/UserService'
import { ErrorHandler } from '@/utils/errorHandler'
import { useAuth } from '@/context/AuthContext'
import type { FichaSocial } from '@/types'

export function useFichasSociales() {
  const { user } = useAuth()
  const [fichas, setFichas] = useState<FichaSocial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFichas()
  }, [])

  async function loadFichas(filtros?: {
    apellidos?: string
    estado?: string
    distrito?: string
  }) {
    try {
      setLoading(true)
      setError(null)
      const data = await FichaSocialService.getFichas(filtros)
      setFichas(data)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function createFicha(fichaData: Partial<FichaSocial>) {
    if (!user) throw new Error('Usuario no autenticado')

    try {
      const usuarioId = await UserService.getUserId(user.auth_user_id)
      const nuevaFicha = await FichaSocialService.createFicha(
        fichaData,
        usuarioId
      )
      setFichas([nuevaFicha, ...fichas])
      return nuevaFicha
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      throw new Error(errorMessage)
    }
  }

  async function updateFicha(id: string, fichaData: Partial<FichaSocial>) {
    if (!user) throw new Error('Usuario no autenticado')

    try {
      const usuarioId = await UserService.getUserId(user.auth_user_id)
      const fichaActualizada = await FichaSocialService.updateFicha(
        id,
        fichaData,
        usuarioId
      )
      setFichas(fichas.map((f) => (f.id === id ? fichaActualizada : f)))
      return fichaActualizada
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      throw new Error(errorMessage)
    }
  }

  async function deleteFicha(id: string) {
    try {
      await FichaSocialService.deleteFicha(id)
      setFichas(fichas.filter((f) => f.id !== id))
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleSupabaseError(err)
      throw new Error(errorMessage)
    }
  }

  return {
    fichas,
    loading,
    error,
    loadFichas,
    createFicha,
    updateFicha,
    deleteFicha,
  }
}
