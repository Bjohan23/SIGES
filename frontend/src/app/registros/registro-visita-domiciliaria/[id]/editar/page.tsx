'use client'

// app/registros/registro-visita-domiciliaria/[id]/editar/page.tsx
// Página para editar Registro de Visita Domiciliaria

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { RegistroVisitaDomiciliariaService, UpdateRegistroVisitaDomiciliariaData } from '@/services/RegistroVisitaDomiciliariaService'
import type { RegistroVisitaDomiciliaria } from '@/services/RegistroVisitaDomiciliariaService'

export default function EditarRegistroVisitaDomiciliariaPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [registro, setRegistro] = useState<RegistroVisitaDomiciliaria | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [nombreEntrevistado, setNombreEntrevistado] = useState('')
  const [domicilio, setDomicilio] = useState('')
  const [fechaVisita, setFechaVisita] = useState('')
  const [responsable, setResponsable] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [relato, setRelato] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (params.id && user) {
      loadRegistro(params.id as string)
    }
  }, [params.id, user])

  const loadRegistro = async (id: string) => {
    try {
      setLoading(true)
      const data = await RegistroVisitaDomiciliariaService.getRegistroVisitaDomiciliariaById(id)
      setRegistro(data)

      // Cargar datos en el formulario
      setNombreEntrevistado(data.nombre_entrevistado || '')
      setDomicilio(data.domicilio || '')
      setFechaVisita(data.fecha_visita ? new Date(data.fecha_visita).toISOString().split('T')[0] : '')
      setResponsable(data.responsable || '')
      setObjetivo(data.objetivo || '')
      setRelato(data.relato || '')
    } catch (err: any) {
      setError(err.message || 'Error al cargar el registro de visita domiciliaria')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!registro) return

    try {
      setSaving(true)

      const data: UpdateRegistroVisitaDomiciliariaData = {
        nombre_entrevistado: nombreEntrevistado.trim() || undefined,
        domicilio: domicilio.trim() || undefined,
        fecha_visita: fechaVisita ? new Date(fechaVisita) : undefined,
        responsable: responsable.trim() || undefined,
        objetivo: objetivo.trim() || undefined,
        relato: relato.trim() || undefined,
      }

      await RegistroVisitaDomiciliariaService.updateRegistroVisitaDomiciliaria(registro.id, data)
      setSuccess('Registro de visita domiciliaria actualizado exitosamente')
      setTimeout(() => {
        router.push(`/registros/registro-visita-domiciliaria/${registro.id}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el registro de visita domiciliaria')
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

  if (error && !registro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/registro-visita-domiciliaria')}
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
            onClick={() => router.push(`/registros/registro-visita-domiciliaria/${registro?.id}`)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver al detalle
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Editar Registro de Visita Domiciliaria
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Actualice la información del registro
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Entrevistado *
                </label>
                <input
                  type="text"
                  value={nombreEntrevistado}
                  onChange={(e) => setNombreEntrevistado(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Domicilio
                </label>
                <input
                  type="text"
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Visita
                </label>
                <input
                  type="date"
                  value={fechaVisita}
                  onChange={(e) => setFechaVisita(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Responsable
                </label>
                <input
                  type="text"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del responsable"
                />
              </div>
            </div>
          </div>

          {/* II. Objetivo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              II. OBJETIVO
            </h3>
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa el objetivo de la visita..."
            />
          </div>

          {/* III. Relato */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              III. RELATO
            </h3>
            <textarea
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa detalladamente el desarrollo de la visita domiciliaria..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/registros/registro-visita-domiciliaria/${registro?.id}`)}
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
