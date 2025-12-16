'use client'

// app/entrevistas/nuevo/page.tsx
// Página para crear nueva Entrevista

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEntrevistas } from '@/hooks/useEntrevistas'
import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import ErrorAlert from '@/components/ErrorAlert'

export default function NuevaEntrevistaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { createEntrevista } = useEntrevistas()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Datos del estudiante
  const [estudianteApellidos, setEstudianteApellidos] = useState('')
  const [estudianteNombres, setEstudianteNombres] = useState('')
  const [estudianteEdad, setEstudianteEdad] = useState('')
  const [estudianteFechaNacimiento, setEstudianteFechaNacimiento] = useState('')
  const [grado, setGrado] = useState('')
  const [aula, setAula] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)

      await createEntrevista({
        estudiante_apellidos: estudianteApellidos,
        estudiante_nombres: estudianteNombres,
        estudiante_edad: parseInt(estudianteEdad),
        estudiante_fecha_nacimiento: estudianteFechaNacimiento,
        grado,
        aula,
        respuestas: {},
        estado: 'incompleta',
        porcentaje_completado: 10,
      })

      alert('Entrevista creada exitosamente')
      router.push('/entrevistas')
    } catch (err: any) {
      setError(err.message || 'Error al crear la entrevista')
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
            Nueva Entrevista
          </h1>
          <p className="text-gray-600 mt-1">
            Registre los datos del estudiante para la entrevista socioemocional
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Datos del Estudiante
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="estudianteApellidos"
                label="Apellidos del Estudiante *"
                type="text"
                value={estudianteApellidos}
                onChange={(e) => setEstudianteApellidos(e.target.value)}
                placeholder="Apellidos completos"
                required
              />

              <InputField
                id="estudianteNombres"
                label="Nombres del Estudiante *"
                type="text"
                value={estudianteNombres}
                onChange={(e) => setEstudianteNombres(e.target.value)}
                placeholder="Nombres completos"
                required
              />

              <InputField
                id="estudianteFechaNacimiento"
                label="Fecha de Nacimiento *"
                type="date"
                value={estudianteFechaNacimiento}
                onChange={(e) => setEstudianteFechaNacimiento(e.target.value)}
                required
              />

              <InputField
                id="estudianteEdad"
                label="Edad *"
                type="number"
                value={estudianteEdad}
                onChange={(e) => setEstudianteEdad(e.target.value)}
                placeholder="Edad en años"
                required
              />

              <InputField
                id="grado"
                label="Grado *"
                type="text"
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                placeholder="Ej: 5to Primaria"
                required
              />

              <InputField
                id="aula"
                label="Aula *"
                type="text"
                value={aula}
                onChange={(e) => setAula(e.target.value)}
                placeholder="Ej: A, B, C"
                required
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Esta es una versión simplificada del formulario. Los datos de
                    la entrevista completa se pueden agregar posteriormente
                    editando el registro.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/entrevistas')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Entrevista'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
