'use client'

// app/registros/informe-social/nuevo/page.tsx
// Página para crear nuevo Informe Social

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { InformeSocialService, CreateInformeSocialData } from '@/services/InformeSocialService'

export default function NuevoInformeSocialPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // I. Datos generales (Datos del padre/tutor/apoderado)
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
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones básicas
    if (!nombresApellidos.trim()) {
      setError('Los nombres y apellidos son obligatorios')
      return
    }

    if (!motivo.trim()) {
      setError('El motivo es obligatorio')
      return
    }

    try {
      setLoading(true)

      const data: CreateInformeSocialData = {
        nombres_apellidos: nombresApellidos.trim(),
        edad: edad ? parseInt(edad) : undefined,
        estado_civil: estadoCivil || undefined,
        grado_instruccion: gradoInstruccion || undefined,
        direccion: direccion || undefined,
        motivo: motivo.trim(),
        situacion_familiar: situacionFamiliar || {},
        situacion_economica: situacionEconomica || {},
        vivienda: vivienda || {},
        educacion: educacion || {},
        problema_social: problemaSocial || {},
        apreciacion_profesional: apreciacionProfesional || undefined,
        lugar: lugar || undefined,
        fecha: fecha || undefined,
      }

      await InformeSocialService.createInformeSocial(data)
      setSuccess('Informe social creado exitosamente')
      setTimeout(() => {
        router.push('/registros/informe-social')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al crear el informe social')
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push('/registros/informe-social')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver a Informes Sociales
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nuevo Informe Social
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Registro de Informe Social de Familiares/Padres/Tutores
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
                    Nombres y Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombresApellidos}
                    onChange={(e) => setNombresApellidos(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Nombres y apellidos completos"
                    required
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
                    placeholder="Edad"
                    min="0"
                    max="120"
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
                    placeholder="Ej: Secundaria completa"
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
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describa el motivo del informe social..."
                  required
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
              placeholder="Describa la situación familiar..."
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
              placeholder="Describa la situación económica..."
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
              placeholder="Describa las condiciones de vivienda..."
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
              placeholder="Describa la situación educativa..."
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
              placeholder="Describa el problema social detectado..."
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
                  placeholder="Apreciación profesional del caso..."
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
                  placeholder="Ej: Chiclayo"
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
              onClick={() => router.push('/registros/informe-social')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Informe Social'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
