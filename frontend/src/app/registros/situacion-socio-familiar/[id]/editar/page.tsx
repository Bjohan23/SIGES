'use client'

// app/registros/situacion-socio-familiar/[id]/editar/page.tsx
// Página para editar Situación Socio Familiar

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { SituacionSocioFamiliarService, UpdateSituacionSocioFamiliarData } from '@/services/SituacionSocioFamiliarService'
import type { SituacionSocioFamiliar } from '@/services/SituacionSocioFamiliarService'

export default function EditarSituacionSocioFamiliarPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [situacion, setSituacion] = useState<SituacionSocioFamiliar | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [subsistemaConyugal, setSubsistemaConyugal] = useState('')
  const [subsistemaPaternoFiscal, setSubsistemaPaternoFiscal] = useState('')
  const [subsistemaFraternal, setSubsistemaFraternal] = useState('')
  const [solidaridadFamiliar, setSolidaridadFamiliar] = useState('')
  const [relaciones, setRelaciones] = useState('')
  const [desempenoRoles, setDesempenoRoles] = useState('')
  const [relacionesCrianza, setRelacionesCrianza] = useState('')
  const [relacionesExogrupo, setRelacionesExogrupo] = useState('')
  const [pautasVidaFamiliar, setPautasVidaFamiliar] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (params.id && user) {
      loadSituacion(params.id as string)
    }
  }, [params.id, user])

  const loadSituacion = async (id: string) => {
    try {
      setLoading(true)
      const data = await SituacionSocioFamiliarService.getSituacionSocioFamiliarById(id)
      setSituacion(data)
      setSubsistemaConyugal(data.subsistema_conyugal || '')
      setSubsistemaPaternoFiscal(data.subsistema_paterno_fiscal || '')
      setSubsistemaFraternal(data.subsistema_fraternal || '')
      setSolidaridadFamiliar(data.solidaridad_familiar || '')
      setRelaciones(data.relaciones || '')
      setDesempenoRoles(data.desempeno_roles || '')
      setRelacionesCrianza(data.relaciones_crianza || '')
      setRelacionesExogrupo(data.relaciones_exogrupo || '')
      setPautasVidaFamiliar(data.pautas_vida_familiar || '')
    } catch (err: any) {
      setError(err.message || 'Error al cargar la situación socio familiar')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!situacion) return

    try {
      setSaving(true)

      const data: UpdateSituacionSocioFamiliarData = {
        subsistema_conyugal: subsistemaConyugal.trim() || undefined,
        subsistema_paterno_fiscal: subsistemaPaternoFiscal.trim() || undefined,
        subsistema_fraternal: subsistemaFraternal.trim() || undefined,
        solidaridad_familiar: solidaridadFamiliar.trim() || undefined,
        relaciones: relaciones.trim() || undefined,
        desempeno_roles: desempenoRoles.trim() || undefined,
        relaciones_crianza: relacionesCrianza.trim() || undefined,
        relaciones_exogrupo: relacionesExogrupo.trim() || undefined,
        pautas_vida_familiar: pautasVidaFamiliar.trim() || undefined,
      }

      await SituacionSocioFamiliarService.updateSituacionSocioFamiliar(situacion.id, data)
      setSuccess('Situación socio familiar actualizada exitosamente')
      setTimeout(() => {
        router.push(`/registros/situacion-socio-familiar/${situacion.id}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la situación socio familiar')
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

  if (error && !situacion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/situacion-socio-familiar')}
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
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push(`/registros/situacion-socio-familiar/${situacion?.id}`)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver al detalle
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Editar Situación Socio Familiar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Modifique los datos de la situación socio familiar
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
          {/* INTERACCIÓN Y UNIDAD FAMILIAR */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              INTERACCIÓN Y UNIDAD FAMILIAR
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subsistema Conyugal
                </label>
                <textarea
                  value={subsistemaConyugal}
                  onChange={(e) => setSubsistemaConyugal(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describa el subsistema conyugal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subsistema Paterno Filial
                </label>
                <textarea
                  value={subsistemaPaternoFiscal}
                  onChange={(e) => setSubsistemaPaternoFiscal(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describa el subsistema paterno filial..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subsistema Fraternal
                </label>
                <textarea
                  value={subsistemaFraternal}
                  onChange={(e) => setSubsistemaFraternal(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describa el subsistema fraternal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Solidaridad Familiar
                </label>
                <textarea
                  value={solidaridadFamiliar}
                  onChange={(e) => setSolidaridadFamiliar(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describa la solidaridad familiar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Las Relaciones
                </label>
                <textarea
                  value={relaciones}
                  onChange={(e) => setRelaciones(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describa las relaciones: cooperación, agresión, amor, comprensión, etc..."
                />
              </div>
            </div>
          </div>

          {/* DESEMPEÑO DE ROLES */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              DESEMPEÑO DE ROLES DE LOS MIEMBROS
            </h3>
            <textarea
              value={desempenoRoles}
              onChange={(e) => setDesempenoRoles(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Obligaciones, provisión económica, afectiva y socializadora. Derechos, Colaboración..."
            />
          </div>

          {/* RELACIONES DE CRIANZA */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              RELACIONES DE CRIANZA FAMILIAR
            </h3>
            <textarea
              value={relacionesCrianza}
              onChange={(e) => setRelacionesCrianza(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Órdenes: Autoritaria, democrática, permisiva. Tipos de reforzadores. Conductas..."
            />
          </div>

          {/* RELACIONES CON EL EXOGRUPO */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              RELACIONES DE LA FAMILIA CON EL EXOGRUPO
            </h3>
            <textarea
              value={relacionesExogrupo}
              onChange={(e) => setRelacionesExogrupo(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Vecinos. Participación de organizaciones vecinales, clubes, centros vecinales, grupos..."
            />
          </div>

          {/* PAUTAS DE VIDA FAMILIAR */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              PAUTAS DE LA VIDA FAMILIAR
            </h3>
            <textarea
              value={pautasVidaFamiliar}
              onChange={(e) => setPautasVidaFamiliar(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Encuentros de las familias, fechas especiales, aniversarios. Sistemas de recreación. Valores..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/registros/situacion-socio-familiar/${situacion?.id}`)}
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
