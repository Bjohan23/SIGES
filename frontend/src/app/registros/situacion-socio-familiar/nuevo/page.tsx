'use client'

// app/registros/situacion-socio-familiar/nuevo/page.tsx
// Página para crear nueva Situación Socio Familiar

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { SituacionSocioFamiliarService, CreateSituacionSocioFamiliarData } from '@/services/SituacionSocioFamiliarService'

export default function NuevaSituacionSocioFamiliarPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [subsistemaConyugal, setSubsistemaConyugal] = useState('')
  const [subsistemaPaternoFiscal, setSubsistemaPaternoFiscal] = useState('')
  const [subsistemaFraternal, setSubsistemaFraternal] = useState('')
  const [solidaridadFamiliar, setSolidaridadFamiliar] = useState('')
  const [relaciones, setRelaciones] = useState('')
  const [desempenoRoles, setDesempenoRoles] = useState('')
  const [relacionesCrianza, setRelacionesCrianza] = useState('')
  const [relacionesExogrupo, setRelacionesExogrupo] = useState('')
  const [pautasVidaFamiliar, setPautasVidaFamiliar] = useState('')

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

    try {
      setLoading(true)

      const data: CreateSituacionSocioFamiliarData = {
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

      await SituacionSocioFamiliarService.createSituacionSocioFamiliar(data)
      setSuccess('Situación socio familiar creada exitosamente')
      setTimeout(() => {
        router.push('/registros/situacion-socio-familiar')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al crear la situación socio familiar')
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
            onClick={() => router.push('/registros/situacion-socio-familiar')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver a la lista
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nueva Situación Socio Familiar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete los datos de la situación socio familiar
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
              onClick={() => router.push('/registros/situacion-socio-familiar')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Situación'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
