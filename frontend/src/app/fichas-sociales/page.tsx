'use client'

// app/fichas-sociales/page.tsx
// Página de listado de Fichas Sociales

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useFichasSociales } from '@/hooks/useFichasSociales'
import Navbar from '@/components/Navbar'
import FichasTable from '@/components/FichasTable'
import FichasFilters from '@/components/FichasFilters'
import ErrorAlert from '@/components/ErrorAlert'
import { fichaSocialAlerts } from '@/components/FichaSocialAlert'

export default function FichasSocialesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { fichas, loading, error, loadFichas, deleteFicha } =
    useFichasSociales()

  // Proteger ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleFilter = (filtros: any) => {
    loadFichas(filtros)
  }

  const handleDelete = async (id: string) => {
    try {
      // Find the ficha to show in the alert
      const fichaToDelete = fichas.find(f => f.id === id)
      await deleteFicha(id)
      if (fichaToDelete) {
        fichaSocialAlerts.success(
          fichaToDelete,
          'Ficha eliminada correctamente',
          'La ficha social ha sido eliminada del sistema'
        )
      }
    } catch (error: any) {
      const fichaError = fichas.find(f => f.id === id)
      if (fichaError) {
        fichaSocialAlerts.error(
          fichaError,
          'Error al eliminar la ficha',
          error.message || 'No se pudo eliminar la ficha social'
        )
      }
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Fichas Sociales
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de fichas sociales de familias
            </p>
          </div>
          <Link
            href="/fichas-sociales/nuevo"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            + Nueva Ficha
          </Link>
        </div>

        {/* Filtros */}
        <FichasFilters onFilter={handleFilter} />

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <>
            {/* Alertas para estados inconsistentes */}
            {fichas.filter(ficha =>
              ficha.estado === 'INCOMPLETA' && ficha.porcentaje_completado === 100
            ).map(ficha => (
              <div key={`alert-${ficha.id}`} className="mb-4">
                <div
                  className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                  onClick={() => fichaSocialAlerts.warning(
                    ficha,
                    "Estado inconsistente detectado",
                    `La ficha muestra 100% de progreso pero está marcada como INCOMPLETA. ${
                      ficha._count?.entrevistas === 0
                        ? 'Posible causa: Requiere al menos una entrevista para completar el estado.'
                        : 'Verifique los campos obligatorios faltantes.'
                    }`
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Estado inconsistente: {ficha.nombres} {ficha.apellidos}
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        100% completado pero estado INCOMPLETA. Click para ver detalles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Tabla */}
            <FichasTable fichas={fichas} onDelete={handleDelete} />

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total: {fichas.length} ficha{fichas.length !== 1 ? 's' : ''}
              {fichas.filter(f => f.estado === 'INCOMPLETA' && f.porcentaje_completado === 100).length > 0 && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                  ({fichas.filter(f => f.estado === 'INCOMPLETA' && f.porcentaje_completado === 100).length} con estado inconsistente)
                </span>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
