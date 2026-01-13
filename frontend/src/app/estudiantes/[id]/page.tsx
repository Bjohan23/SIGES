'use client'

// app/estudiantes/[id]/page.tsx
// Página de detalles de un Estudiante

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { EstudianteService } from '@/services/EstudianteService'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import type { Estudiante } from '@/types'

export default function EstudianteDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar estudiante
  useEffect(() => {
    const loadEstudiante = async () => {
      try {
        const id = params.id as string
        const data = await EstudianteService.getEstudianteById(id)
        setEstudiante(data)
      } catch (error: any) {
        console.error('Error al cargar estudiante:', error)
        setError(error.message || 'Error al cargar el estudiante')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadEstudiante()
    }
  }, [params.id])

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  if (error || !estudiante) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error || 'Estudiante no encontrado'} />
          <Link
            href="/estudiantes"
            className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Volver a la lista
          </Link>
        </main>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No registrado'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/estudiantes"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Detalle del Estudiante
          </h1>
        </div>

        {/* Información del estudiante */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header con nombre completo */}
          <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              {estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}
            </h2>
            <p className="text-indigo-200 mt-1">Código: {estudiante.codigo}</p>
          </div>

          {/* Estado */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                estudiante.activo
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}
            >
              {estudiante.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {/* Información personal */}
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Información Personal
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Código</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{estudiante.codigo}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">DNI</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {estudiante.dni || 'No registrado'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Apellido Paterno</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {estudiante.apellido_paterno}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Apellido Materno</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {estudiante.apellido_materno}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombres</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{estudiante.nombres}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Nacimiento</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(estudiante.fecha_nacimiento)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {estudiante.telefono || 'No registrado'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {estudiante.email || 'No registrado'}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {estudiante.direccion || 'No registrada'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Fechas */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Información de Registro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium">Creado:</span>{' '}
                {new Date(estudiante.created_at).toLocaleString('es-ES')}
              </div>
              <div>
                <span className="font-medium">Actualizado:</span>{' '}
                {new Date(estudiante.updated_at).toLocaleString('es-ES')}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Link
              href="/estudiantes"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Volver
            </Link>
            <Link
              href={`/estudiantes/${estudiante.id}/editar`}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Editar
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
