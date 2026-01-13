'use client'

// app/entrevistas/[id]/page.tsx
// Página de detalles de Entrevista

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { EntrevistaService } from '@/services/EntrevistaService'
import type { EntrevistaAplicada } from '@/types'

export default function EntrevistaDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [entrevista, setEntrevista] = useState<EntrevistaAplicada | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (params.id && user) {
      loadEntrevista(params.id as string)
    }
  }, [params.id, user])

  const loadEntrevista = async (id: string) => {
    try {
      setLoading(true)
      const data = await EntrevistaService.getEntrevistaById(id)
      setEntrevista(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar la entrevista')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!entrevista) return

    if (confirm('¿Está seguro de que desea eliminar esta entrevista?')) {
      try {
        await EntrevistaService.deleteEntrevista(entrevista.id)
        setSuccess('Entrevista eliminada exitosamente')
        setTimeout(() => {
          router.push('/entrevistas')
        }, 1500)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la entrevista')
      }
    }
  }

  const getRespuesta = (key: string): string => {
    if (!entrevista?.respuestas) return ''
    return entrevista.respuestas[key] || ''
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error && !entrevista) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/entrevistas')}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Volver a la lista
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              type="button"
              onClick={() => router.push('/entrevistas')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle de Entrevista
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Influencia Familiar y Educativa en el Aprendizaje
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push(`/entrevistas/${entrevista?.id}/editar`)}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6">
            <SuccessAlert message={success} />
          </div>
        )}

        {entrevista && (
          <div className="space-y-6">
            {/* Datos del Estudiante */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Datos del Estudiante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{entrevista.estudiante_nombres}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Apellidos:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{entrevista.estudiante_apellidos}</p>
                </div>
                {entrevista.estudiante_edad && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Edad:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{entrevista.estudiante_edad} años</p>
                  </div>
                )}
                {entrevista.grado && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grado:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{entrevista.grado}</p>
                  </div>
                )}
                {entrevista.aula && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Aula:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{entrevista.aula}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entrevista.estado?.toLowerCase() === 'completa'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {entrevista.estado}
                    </span>
                  </p>
                </div>
                {entrevista.porcentaje_completado !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progreso:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{entrevista.porcentaje_completado}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Respuestas de la Entrevista */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Respuestas de la Entrevista
              </h3>
              <div className="space-y-6">
                {/* Pregunta 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    1. ¿Con quienes vives en casa?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_1') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    2. ¿Cómo es la relación con las personas con las que vives en casa?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg mb-2">
                    Opción: {getRespuesta('pregunta_2_opcion') || 'Sin respuesta'}
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    ¿Por qué?: {getRespuesta('pregunta_2_porque') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 3 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    3. ¿Con qué integrante de tu familia tiene más confianza para contarle cómo te sientes?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_3') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 4 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    4. ¿Hay alguna persona en tu familia con la que te cueste trabajo hablar o compartir tus sentimientos?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_4') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 5 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    5. ¿Sientes que el ambiente en el salón de clases es respetuoso y acogedor para todos?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_5') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 6 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    6. ¿Hay algún lugar o momento durante la clase en el que te sientas incómodo?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_6') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 7 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    7. ¿Hay algún compañero con el que se te haga difícil trabajar o llevarte bien?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_7') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 8 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    8. ¿Qué es lo que más te gusta del grupo de amigos de tu salón?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_8') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 9 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    9. Cuando trabajan en equipo, ¿sientes que todos colaboran y hacen su parte?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_9') || 'Sin respuesta'}
                  </p>
                </div>

                {/* Pregunta 10 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    10. ¿Hay algún tema o actividad que te parezca confuso o difícil de entender?
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getRespuesta('pregunta_10') || 'Sin respuesta'}
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Información de la Entrevista
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de creación:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {entrevista.created_at ? new Date(entrevista.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última actualización:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {entrevista.updated_at ? new Date(entrevista.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
