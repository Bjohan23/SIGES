'use client'

// app/familias-disfuncionales/nuevo/page.tsx
// Página para registrar nueva Familia Disfuncional

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useFamiliasDisfuncionales } from '@/hooks/useFamiliasDisfuncionales'
import { useFichasSociales } from '@/hooks/useFichasSociales'
import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import ErrorAlert from '@/components/ErrorAlert'

export default function NuevaFamiliaDisfuncionalPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { marcarComoDisfuncional } = useFamiliasDisfuncionales()
  const { fichas } = useFichasSociales()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [fichaId, setFichaId] = useState('')
  const [fechaEvaluacion, setFechaEvaluacion] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [observaciones, setObservaciones] = useState('')
  const [criteriosEvaluacion, setCriteriosEvaluacion] = useState('')
  const [requiereSeguimiento, setRequiereSeguimiento] = useState(true)
  const [seguimientoActivo, setSeguimientoActivo] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fichaId) {
      setError('Debe seleccionar una ficha social')
      return
    }

    try {
      setLoading(true)

      await marcarComoDisfuncional(fichaId, {
        fecha_evaluacion: fechaEvaluacion,
        observaciones: observaciones || undefined,
        criterios_evaluacion: criteriosEvaluacion || undefined,
        requiere_seguimiento: requiereSeguimiento,
        seguimiento_activo: seguimientoActivo,
        indicadores: {},
      })

      alert('Familia marcada como disfuncional exitosamente')
      router.push('/familias-disfuncionales')
    } catch (err: any) {
      setError(err.message || 'Error al registrar la familia disfuncional')
    } finally {
      setLoading(false)
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Nuevo Caso: Familia Disfuncional
          </h1>
          <p className="text-gray-600 mt-1">
            Registre una familia que requiere atención prioritaria
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="fichaId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ficha Social *
                </label>
                <select
                  id="fichaId"
                  value={fichaId}
                  onChange={(e) => setFichaId(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Seleccione una ficha social...</option>
                  {fichas.map((ficha) => (
                    <option key={ficha.id} value={ficha.id}>
                      {ficha.apellidos}, {ficha.nombres} - {ficha.distrito || 'Sin distrito'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Seleccione la familia que será marcada como disfuncional
                </p>
              </div>

              <InputField
                id="fechaEvaluacion"
                label="Fecha de Evaluación *"
                type="date"
                value={fechaEvaluacion}
                onChange={(e) => setFechaEvaluacion(e.target.value)}
                required
              />

              <div>
                <label
                  htmlFor="criteriosEvaluacion"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Criterios de Evaluación
                </label>
                <textarea
                  id="criteriosEvaluacion"
                  value={criteriosEvaluacion}
                  onChange={(e) => setCriteriosEvaluacion(e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describa los criterios utilizados para evaluar esta familia..."
                />
              </div>

              <div>
                <label
                  htmlFor="observaciones"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Observaciones adicionales sobre la situación de la familia..."
                />
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <input
                    id="requiereSeguimiento"
                    type="checkbox"
                    checked={requiereSeguimiento}
                    onChange={(e) => setRequiereSeguimiento(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="requiereSeguimiento"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Requiere seguimiento
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="seguimientoActivo"
                    type="checkbox"
                    checked={seguimientoActivo}
                    onChange={(e) => setSeguimientoActivo(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="seguimientoActivo"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Seguimiento activo
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Importante:</strong> Esta acción marcará a la familia
                    como disfuncional y requerirá seguimiento especial. Asegúrese
                    de haber evaluado correctamente la situación.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/familias-disfuncionales')}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="danger" disabled={loading}>
                {loading ? 'Guardando...' : 'Registrar Caso'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
