'use client'

// app/dashboard/page.tsx
// Página principal del Dashboard

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'
import Navbar from '@/components/Navbar'
import StatCard from '@/components/StatCard'
import ErrorAlert from '@/components/ErrorAlert'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { estadisticas, loading, error } = useDashboard()

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y fecha */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bienvenido al Sistema de Gestión Social - I.E. Nicolás La Torre García
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Última actualización: {new Date().toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        {!loading && estadisticas && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Fichas */}
              <StatCard
                title="Total Fichas"
                value={estadisticas.total_fichas}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                }
              />

              {/* Fichas Completas */}
              <StatCard
                title="Fichas Completas"
                value={estadisticas.fichas_completas}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                }
              />

              {/* Fichas Pendientes */}
              <StatCard
                title="Fichas Pendientes"
                value={estadisticas.fichas_pendientes}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                }
              />

              {/* Familias Disfuncionales */}
              <StatCard
                title="Familias Disfuncionales"
                value={estadisticas.familias_disfuncionales}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                }
              />
            </div>

            {/* Fila adicional de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Entrevistas */}
              <StatCard
                title="Total Entrevistas"
                value={estadisticas.total_entrevistas}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                }
              />

              {/* Entrevistas Completas */}
              <StatCard
                title="Entrevistas Completas"
                value={estadisticas.entrevistas_completas}
                iconBgColor="bg-teal-100"
                iconColor="text-teal-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    ></path>
                  </svg>
                }
              />

              {/* Usuarios Activos */}
              <StatCard
                title="Usuarios Activos"
                value={estadisticas.usuarios_activos}
                iconBgColor="bg-indigo-100"
                iconColor="text-indigo-600"
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                }
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
