// hooks/useEntrevistas.ts
// Single Responsibility: Hook para manejar lógica de entrevistas

import { useState, useEffect } from 'react'
import { EntrevistaService, CreateEntrevistaData, UpdateEntrevistaData } from '@/services/EntrevistaService'
import { ErrorHandler } from '@/utils/errorHandler'
import type { EntrevistaAplicada } from '@/types'

export function useEntrevistas() {
  const [entrevistas, setEntrevistas] = useState<EntrevistaAplicada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  useEffect(() => {
    loadEntrevistas()
  }, [])

  async function loadEntrevistas(filtros?: {
    estudiante_nombres?: string
    estudiante_apellidos?: string
    grado?: string
    aula?: string
    estado?: string
    page?: number
    limit?: number
  }) {
    try {
      setLoading(true)
      setError(null)
      const response = await EntrevistaService.getEntrevistas(filtros)
      setEntrevistas(response.data)
      setPagination(response.pagination)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function createEntrevista(data: CreateEntrevistaData) {
    try {
      const nuevaEntrevista = await EntrevistaService.createEntrevista(data)
      setEntrevistas([nuevaEntrevista, ...entrevistas])
      return nuevaEntrevista
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  async function updateEntrevista(id: string, data: UpdateEntrevistaData) {
    try {
      const entrevistaActualizada = await EntrevistaService.updateEntrevista(id, data)
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
    pagination,
    loadEntrevistas,
    createEntrevista,
    updateEntrevista,
    deleteEntrevista,
  }
}
