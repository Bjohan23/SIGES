'use client'

// app/registros/registro-entrevista/nuevo/page.tsx
// Página para crear nuevo Registro de Entrevista

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import StudentSelector from '@/components/ui/StudentSelector'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { RegistroEntrevistaService, CreateRegistroEntrevistaData } from '@/services/RegistroEntrevistaService'

export default function NuevoRegistroEntrevistaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [estudianteId, setEstudianteId] = useState('')
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [hora, setHora] = useState('')
  const [tema, setTema] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [entrevistado, setEntrevistado] = useState('')
  const [entrevistador, setEntrevistador] = useState('')
  const [descripcionRelato, setDescripcionRelato] = useState('')

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

    if (!tema.trim()) {
      setError('El tema es obligatorio')
      return
    }

    try {
      setLoading(true)

      const data: CreateRegistroEntrevistaData = {
        estudiante_id: estudianteId || undefined,
        lugar: lugar.trim() || undefined,
        fecha: fecha || undefined,
        hora: hora.trim() || undefined,
        tema: tema.trim(),
        objetivo: objetivo.trim() || undefined,
        entrevistado: entrevistado.trim() || undefined,
        entrevistador: entrevistador.trim() || undefined,
        descripcion_relato: descripcionRelato.trim() || undefined,
      }

      await RegistroEntrevistaService.createRegistroEntrevista(data)
      setSuccess('Registro de entrevista creado exitosamente')
      setTimeout(() => {
        router.push('/registros/registro-entrevista')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al crear el registro de entrevista')
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
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push('/registros/registro-entrevista')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
          >
            ← Volver a la lista
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nuevo Registro de Entrevista
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete los datos del registro de entrevista
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
          {/* Selección de estudiante */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Estudiante
            </h3>
            <StudentSelector
              value={estudianteId}
              onChange={setEstudianteId}
              placeholder="Seleccionar estudiante (opcional)"
            />
          </div>

          {/* Datos de la entrevista */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Datos de la Entrevista
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lugar
                </label>
                <input
                  type="text"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Despacho de tutoría"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  placeholder="Seleccionar fecha"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  placeholder="Seleccionar hora"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tema *
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Seguimiento académico"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Objetivo
                </label>
                <input
                  type="text"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Evaluar situación familiar"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entrevistado
                </label>
                <input
                  type="text"
                  value={entrevistado}
                  onChange={(e) => setEntrevistado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del entrevistado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entrevistador
                </label>
                <input
                  type="text"
                  value={entrevistador}
                  onChange={(e) => setEntrevistador(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del entrevistador"
                />
              </div>
            </div>
          </div>

          {/* Descripción y Relato */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Descripción y Relato
            </h3>
            <textarea
              value={descripcionRelato}
              onChange={(e) => setDescripcionRelato(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describa detalladamente el desarrollo de la entrevista..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/registros/registro-entrevista')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Registro'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
