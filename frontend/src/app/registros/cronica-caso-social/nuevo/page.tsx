'use client'

// app/registros/cronica-caso-social/nuevo/page.tsx
// Página para crear nueva Crónica de Caso Social

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { CronicaCasoSocialService, CreateCronicaCasoSocialData } from '@/services/CronicaCasoSocialService'

export default function NuevaCronicaCasoSocialPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [numReunion, setNumReunion] = useState<number | ''>('')
  const [fechaHora, setFechaHora] = useState('')
  const [nombresApellidos, setNombresApellidos] = useState('')
  const [asistentes, setAsistentes] = useState('')
  const [actividadesRealizadas, setActividadesRealizadas] = useState('')
  const [programas, setProgramas] = useState('')
  const [relato, setRelato] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [sugerencias, setSugerencias] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nombresApellidos.trim()) {
      setError('Los nombres y apellidos son obligatorios')
      return
    }

    try {
      setLoading(true)

      const data: CreateCronicaCasoSocialData = {
        nombres_apellidos: nombresApellidos.trim(),
        num_reunion: numReunion || undefined,
        fecha_hora: fechaHora || undefined,
        asistentes: asistentes.trim() || undefined,
        actividades_realizadas: actividadesRealizadas.trim() || undefined,
        programas: programas.trim() || undefined,
        relato: relato.trim() || undefined,
        interpretacion: interpretacion.trim() || undefined,
        sugerencias: sugerencias.trim() || undefined,
      }

      await CronicaCasoSocialService.createCronicaCasoSocial(data)
      setSuccess('Crónica de caso social creada exitosamente')
      setTimeout(() => {
        router.push('/registros/cronica-caso-social')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al crear la crónica de caso social')
    } finally {
      setLoading(false)
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push('/registros/cronica-caso-social')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver a la lista
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nueva Crónica de Caso Social
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete los datos de la crónica
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <SuccessAlert message={success} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* I. Datos Generales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              I. DATOS GENERALES
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nº de Reunión
                </label>
                <input
                  type="number"
                  value={numReunion}
                  onChange={(e) => setNumReunion(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Número de reunión"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombres y Apellidos *
                </label>
                <input
                  type="text"
                  value={nombresApellidos}
                  onChange={(e) => setNombresApellidos(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombres completos y apellidos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asistentes
                </label>
                <input
                  type="text"
                  value={asistentes}
                  onChange={(e) => setAsistentes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Lista de asistentes"
                />
              </div>
            </div>
          </div>

          {/* II. Actividades Realizadas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              II. ACTIVIDADES REALIZADAS
            </h3>
            <textarea
              value={actividadesRealizadas}
              onChange={(e) => setActividadesRealizadas(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa las actividades realizadas..."
            />
          </div>

          {/* III. Programas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              III. PROGRAMAS A REALIZARSE
            </h3>
            <textarea
              value={programas}
              onChange={(e) => setProgramas(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa los programas a realizarse..."
            />
          </div>

          {/* IV. Relato */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              IV. RELATO
            </h3>
            <textarea
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa el relato detallado..."
            />
          </div>

          {/* V. Interpretación */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              V. INTERPRETACIÓN
            </h3>
            <textarea
              value={interpretacion}
              onChange={(e) => setInterpretacion(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Interpretación del caso..."
            />
          </div>

          {/* VI. Sugerencias */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              VI. SUGERENCIAS
            </h3>
            <textarea
              value={sugerencias}
              onChange={(e) => setSugerencias(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Sugerencias y recomendaciones..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/registros/cronica-caso-social')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Crónica'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
