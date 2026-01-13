'use client'

// app/registros/informe-social/[id]/editar/page.tsx
// Página para editar Informe Social

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { InformeSocialService, UpdateInformeSocialData } from '@/services/InformeSocialService'
import type { InformeSocial } from '@/services/InformeSocialService'

export default function EditarInformeSocialPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [informe, setInforme] = useState<InformeSocial | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // I. Datos generales
  const [nombresApellidos, setNombresApellidos] = useState('')
  const [edad, setEdad] = useState('')
  const [estadoCivil, setEstadoCivil] = useState('')
  const [gradoInstruccion, setGradoInstruccion] = useState('')
  const [direccion, setDireccion] = useState('')
  const [motivo, setMotivo] = useState('')

  // II. Situación familiar
  const [situacionFamiliar, setSituacionFamiliar] = useState('')

  // III. Situación económica
  const [situacionEconomica, setSituacionEconomica] = useState('')

  // IV. Vivienda
  const [vivienda, setVivienda] = useState('')

  // V. Educación
  const [educacion, setEducacion] = useState('')

  // VI. Problema social
  const [problemaSocial, setProblemaSocial] = useState('')

  // VII. Apreciación profesional
  const [apreciacionProfesional, setApreciacionProfesional] = useState('')
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')

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
      const data = await InformeSocialService.getInformeSocialById(id)
      setInforme(data)

      // Cargar datos en el formulario
      setNombresApellidos(data.nombres_apellidos || '')
      setEdad(data.edad?.toString() || '')
      setEstadoCivil(data.estado_civil || '')
      setGradoInstruccion(data.grado_instruccion || '')
      setDireccion(data.direccion || '')
      setMotivo(data.motivo || '')
      setSituacionFamiliar(typeof data.situacion_familiar === 'string' ? data.situacion_familiar : '')
      setSituacionEconomica(typeof data.situacion_economica === 'string' ? data.situacion_economica : '')
      setVivienda(typeof data.vivienda === 'string' ? data.vivienda : '')
      setEducacion(typeof data.educacion === 'string' ? data.educacion : '')
      setProblemaSocial(typeof data.problema_social === 'string' ? data.problema_social : '')
      setApreciacionProfesional(data.apreciacion_profesional || '')
      setLugar(data.lugar || '')
      setFecha(data.fecha ? new Date(data.fecha).toISOString().split('T')[0] : '')
    } catch (err: any) {
      setError(err.message || 'Error al cargar el informe social')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!informe) return

    try {
      setSaving(true)

      const data: UpdateInformeSocialData = {
        nombres_apellidos: nombresApellidos || undefined,
        edad: edad ? parseInt(edad) : undefined,
        estado_civil: estadoCivil || undefined,
        grado_instruccion: gradoInstruccion || undefined,
        direccion: direccion || undefined,
        motivo: motivo || undefined,
        situacion_familiar: situacionFamiliar || {},
        situacion_economica: situacionEconomica || {},
        vivienda: vivienda || {},
        educacion: educacion || {},
        problema_social: problemaSocial || {},
        apreciacion_profesional: apreciacionProfesional || undefined,
        lugar: lugar || undefined,
        fecha: fecha || undefined,
      }

      await InformeSocialService.updateInformeSocial(informe.id, data)
      setSuccess('Informe social actualizado exitosamente')
      setTimeout(() => {
        router.push(`/registros/informe-social/${informe.id}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el informe social')
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
            onClick={() => router.push('/registros/informe-social')}
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
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push(`/registros/informe-social/${informe?.id}`)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver al detalle
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Editar Informe Social
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Actualice la información del informe social
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
              I. Datos Generales
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombres y Apellidos
                  </label>
                  <input
                    type="text"
                    value={nombresApellidos}
                    onChange={(e) => setNombresApellidos(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado Civil
                  </label>
                  <select
                    value={estadoCivil}
                    onChange={(e) => setEstadoCivil(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Divorciado/a">Divorciado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                    <option value="Conviviente">Conviviente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grado de Instrucción
                  </label>
                  <input
                    type="text"
                    value={gradoInstruccion}
                    onChange={(e) => setGradoInstruccion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* II. Situación Familiar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              II. Situación Familiar
            </h3>
            <textarea
              value={situacionFamiliar}
              onChange={(e) => setSituacionFamiliar(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* III. Situación Económica */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              III. Situación Económica
            </h3>
            <textarea
              value={situacionEconomica}
              onChange={(e) => setSituacionEconomica(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* IV. Vivienda */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              IV. Vivienda
            </h3>
            <textarea
              value={vivienda}
              onChange={(e) => setVivienda(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* V. Educación */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              V. Educación
            </h3>
            <textarea
              value={educacion}
              onChange={(e) => setEducacion(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* VI. Problema Social */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              VI. Problema Social
            </h3>
            <textarea
              value={problemaSocial}
              onChange={(e) => setProblemaSocial(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* VII. Apreciación Profesional */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              VII. Apreciación Profesional
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Apreciación
                </label>
                <textarea
                  value={apreciacionProfesional}
                  onChange={(e) => setApreciacionProfesional(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lugar
                </label>
                <input
                  type="text"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/registros/informe-social/${informe?.id}`)}
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
