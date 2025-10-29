'use client'

// app/entrevistas/page.tsx
// Página de listado de Entrevistas

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useEntrevistas } from '@/hooks/useEntrevistas'
import Navbar from '@/components/Navbar'
import EntrevistasTable from '@/components/EntrevistasTable'
import ErrorAlert from '@/components/ErrorAlert'

export default function EntrevistasPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { entrevistas, loading, error, deleteEntrevista } = useEntrevistas()

  // Proteger ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleDelete = async (id: string) => {
    try {
      await deleteEntrevista(id)
      alert('Entrevista eliminada correctamente')
    } catch (error: any) {
      alert(error.message || 'Error al eliminar la entrevista')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Entrevistas</h1>
            <p className="text-gray-600 mt-1">
              Gestión de entrevistas socioemocionales
            </p>
          </div>
          <Link
            href="/entrevistas/nuevo"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Nueva Entrevista
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Tabla */}
            <EntrevistasTable entrevistas={entrevistas} onDelete={handleDelete} />

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600">
              Total: {entrevistas.length} entrevista
              {entrevistas.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
