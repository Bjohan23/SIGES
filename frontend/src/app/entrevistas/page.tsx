'use client'

// app/entrevistas/page.tsx
// Página de listado de Entrevistas

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'

export default function EntrevistasPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Proteger ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

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
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Entrevistas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de entrevistas socioemocionales
            </p>
          </div>
        </div>

        {/* Mensaje de desarrollo */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Módulo en Desarrollo
              </h2>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                El módulo de entrevistas está actualmente en desarrollo. Las funcionalidades estarán disponibles próximamente.
              </p>
              <div className="mt-3 space-y-2 text-sm text-yellow-600 dark:text-yellow-400">
                <p>• Próximamente: Creación y gestión de entrevistas socioemocionales</p>
                <p>• Próximamente: Seguimiento de progreso de estudiantes</p>
                <p>• Próximamente: Reportes y estadísticas de entrevistas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enlace de retorno */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
