'use client'

// app/registros/informe-visita-domiciliaria/[id]/editar/page.tsx
// Página para editar Informe de Visita Domiciliaria

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { InformeVisitaDomiciliariaService, UpdateInformeVisitaDomiciliariaData } from '@/services/InformeVisitaDomiciliariaService'
import type { InformeVisitaDomiciliaria } from '@/services/InformeVisitaDomiciliariaService'

export default function EditarInformeVisitaDomiciliariaPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [informe, setInforme] = useState<InformeVisitaDomiciliaria | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [nombresApellidos, setNombresApellidos] = useState('')
  const [direccion, setDireccion] = useState('')
  const [motivo, setMotivo] = useState('')
  const [objetivos, setObjetivos] = useState('')
  const [narracion, setNarracion] = useState('')
  const [conclusiones, setConclusiones] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (params.id && user) {
      loadInforme(params.id as string)
    }
  }, [params.id, user])

  const loadInforme = async (id: string) => {
    try {
      setLoading(true)
      const data = await InformeVisitaDomiciliariaService.getInformeVisitaDomiciliariaById(id)
      setInforme(data)
      setNombresApellidos(data.nombres_apellidos || '')
      setDireccion(data.direccion || '')
      setMotivo(data.motivo || '')
      setObjetivos(data.objetivos || '')
      setNarracion(data.narracion || '')
      setConclusiones(data.conclusiones || '')
    } catch (err: any) {
      setError(err.message || 'Error al cargar el informe de visita domiciliaria')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!informe) return

    if (!nombresApellidos.trim()) {
      setError('Los nombres y apellidos son obligatorios')
      return
    }

    try {
      setSaving(true)

      const data: UpdateInformeVisitaDomiciliariaData = {
        nombres_apellidos: nombresApellidos.trim(),
        direccion: direccion.trim() || undefined,
        motivo: motivo.trim() || undefined,
        objetivos: objetivos.trim() || undefined,
        narracion: narracion.trim() || undefined,
        conclusiones: conclusiones.trim() || undefined,
      }

      await InformeVisitaDomiciliariaService.updateInformeVisitaDomiciliaria(informe.id, data)
      setSuccess('Informe de visita domiciliaria actualizado exitosamente')
      setTimeout(() => {
        router.push(`/registros/informe-visita-domiciliaria/${informe.id}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el informe de visita domiciliaria')
    } finally {
      setSaving(false)
    }
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

  if (error && !informe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/informe-visita-domiciliaria')}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push(`/registros/informe-visita-domiciliaria/${informe?.id}`)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver al detalle
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Editar Informe de Visita Domiciliaria
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Modifique los datos del informe
          </p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* I. Datos Generales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              I. DATOS GENERALES
            </h3>

            <div className="space-y-4 mb-4">
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
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Motivo de la visita"
                />
              </div>
            </div>
          </div>

          {/* II. Objetivos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              II. OBJETIVOS DE LA VISITA DOMICILIARIA
            </h3>
            <textarea
              value={objetivos}
              onChange={(e) => setObjetivos(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa los objetivos de la visita domiciliaria..."
            />
          </div>

          {/* III. Narración */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              III. NARRACIÓN DE LA VISITA DOMICILIARIA
            </h3>
            <textarea
              value={narracion}
              onChange={(e) => setNarracion(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa detalladamente el desarrollo de la visita domiciliaria..."
            />
          </div>

          {/* IV. Conclusiones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              IV. CONCLUSIONES
            </h3>
            <textarea
              value={conclusiones}
              onChange={(e) => setConclusiones(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Conclusiones y recomendaciones..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/registros/informe-visita-domiciliaria/${informe?.id}`)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
