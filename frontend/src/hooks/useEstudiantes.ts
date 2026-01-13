// hooks/useEstudiantes.ts
// Single Responsibility: Hook para manejar lógica de estudiantes

import { useState, useEffect } from 'react'
import { EstudianteService } from '@/services/EstudianteService'
import { ErrorHandler } from '@/utils/errorHandler'
import type { Estudiante, CreateEstudianteData, UpdateEstudianteData } from '@/types'

export function useEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
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
    loadEstudiantes()
  }, [])

  async function loadEstudiantes(filtros?: {
    codigo?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    dni?: string
    activo?: boolean
    page?: number
    limit?: number
  }) {
    try {
      setLoading(true)
      setError(null)
      const response = await EstudianteService.getEstudiantes(filtros)
      setEstudiantes(response.data)
      setPagination(response.pagination)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function createEstudiante(data: CreateEstudianteData) {
    try {
      const nuevoEstudiante = await EstudianteService.createEstudiante(data)
      setEstudiantes([nuevoEstudiante, ...estudiantes])
      return nuevoEstudiante
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  async function updateEstudiante(id: string, data: UpdateEstudianteData) {
    try {
      const estudianteActualizado = await EstudianteService.updateEstudiante(
        id,
        data
      )
      setEstudiantes(estudiantes.map((e) => (e.id === id ? estudianteActualizado : e)))
      return estudianteActualizado
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  async function deleteEstudiante(id: string) {
    try {
      await EstudianteService.deleteEstudiante(id)
      setEstudiantes(estudiantes.filter((e) => e.id !== id))
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      throw new Error(errorMessage)
    }
  }

  async function searchEstudiantes(query: string) {
    try {
      setLoading(true)
      setError(null)
      const results = await EstudianteService.searchEstudiantes(query)
      setEstudiantes(results)
    } catch (err: any) {
      const errorMessage = ErrorHandler.handleApiError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    estudiantes,
    loading,
    error,
    pagination,
    loadEstudiantes,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
    searchEstudiantes,
  }
}
