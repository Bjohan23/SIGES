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
      await deleteFicha(id)
      alert('Ficha eliminada correctamente')
    } catch (error: any) {
      alert(error.message || 'Error al eliminar la ficha')
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
            {/* Tabla */}
            <FichasTable fichas={fichas} onDelete={handleDelete} />

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total: {fichas.length} ficha{fichas.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
