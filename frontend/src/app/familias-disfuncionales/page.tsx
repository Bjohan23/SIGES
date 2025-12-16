'use client'

// app/familias-disfuncionales/page.tsx
// Página de listado de Familias Disfuncionales

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useFamiliasDisfuncionales } from '@/hooks/useFamiliasDisfuncionales'
import Navbar from '@/components/Navbar'
import FamiliasTable from '@/components/FamiliasTable'
import ErrorAlert from '@/components/ErrorAlert'
import StatCard from '@/components/StatCard'

export default function FamiliasDisfuncionalesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { familias, loading, error, deleteFamilia } = useFamiliasDisfuncionales()

  // Proteger ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleDelete = async (id: string) => {
    try {
      await deleteFamilia(id)
      alert('Registro eliminado correctamente')
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el registro')
    }
  }

  // Calcular estadísticas
  const totalCasos = familias.length
  const seguimientoActivo = familias.filter((f) => f.seguimiento_activo).length

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Familias Disfuncionales
          </h1>
          <p className="text-gray-600 mt-1">
            Registro y seguimiento de casos que requieren atención prioritaria
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Casos"
            value={totalCasos}
            iconBgColor="bg-gray-100"
            iconColor="text-gray-600"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            }
          />

          <StatCard
            title="Seguimiento Activo"
            value={seguimientoActivo}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            }
          />

          <StatCard
            title="Seguimiento Inactivo"
            value={totalCasos - seguimientoActivo}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            }
          />
        </div>

        {/* Botón agregar */}
        <div className="mb-6 flex justify-end">
          <Link
            href="/familias-disfuncionales/nuevo"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Agregar Caso
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
            <FamiliasTable familias={familias} onDelete={handleDelete} />

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {familias.length} de {familias.length} casos
            </div>
          </>
        )}
      </main>
    </div>
  )
}
