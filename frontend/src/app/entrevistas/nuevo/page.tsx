'use client'

// app/entrevistas/nuevo/page.tsx
// Página para crear nueva Entrevista con el formulario completo

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEntrevistas } from '@/hooks/useEntrevistas'
import { calculateAge } from '@/utils/date'
import StudentSelector from '@/components/ui/StudentSelector'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import type { Estudiante } from '@/types'

export default function NuevaEntrevistaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { createEntrevista } = useEntrevistas()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estudiante seleccionado
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null)

  // Datos adicionales del estudiante
  const [aula, setAula] = useState('')
  const [grado, setGrado] = useState('')

  // Respuestas de la entrevista
  const [pregunta1, setPregunta1] = useState('')
  const [pregunta2Opcion, setPregunta2Opcion] = useState('')
  const [pregunta2Porque, setPregunta2Porque] = useState('')
  const [pregunta3, setPregunta3] = useState('')
  const [pregunta4, setPregunta4] = useState('')
  const [pregunta5, setPregunta5] = useState('')
  const [pregunta6, setPregunta6] = useState('')
  const [pregunta7, setPregunta7] = useState('')
  const [pregunta8, setPregunta8] = useState('')
  const [pregunta9, setPregunta9] = useState('')
  const [pregunta10, setPregunta10] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!selectedStudent) {
      setError('Por favor, seleccione un estudiante')
      return
    }
    if (!grado.trim()) {
      setError('El grado es obligatorio')
      return
    }
    if (!aula.trim()) {
      setError('El aula es obligatoria')
      return
    }

    try {
      setLoading(true)

      const respuestas = {
        pregunta_1: pregunta1,
        pregunta_2_opcion: pregunta2Opcion,
        pregunta_2_porque: pregunta2Porque,
        pregunta_3: pregunta3,
        pregunta_4: pregunta4,
        pregunta_5: pregunta5,
        pregunta_6: pregunta6,
        pregunta_7: pregunta7,
        pregunta_8: pregunta8,
        pregunta_9: pregunta9,
        pregunta_10: pregunta10,
      }

      // Calcular porcentaje completado
      const totalCampos = 10
      const camposCompletados = Object.values(respuestas).filter(
        (val) => val && val.trim().length > 0
      ).length
      const porcentaje = Math.round((camposCompletados / totalCampos) * 100)

      // Determinar estado basado en el porcentaje
      let estado = 'INCOMPLETA'
      if (porcentaje === 100) {
        estado = 'COMPLETA'
      } else if (porcentaje > 0) {
        estado = 'EN_PROCESO'
      }

      await createEntrevista({
        estudiante_id: selectedStudent.id,
        estudiante_nombres: selectedStudent.nombres,
        estudiante_apellidos: `${selectedStudent.apellido_paterno} ${selectedStudent.apellido_materno}`,
        estudiante_edad: calculateAge(selectedStudent.fecha_nacimiento) ?? undefined,
        estudiante_fecha_nacimiento: selectedStudent.fecha_nacimiento,
        grado: grado.trim(),
        aula: aula.trim(),
        respuestas,
        estado,
        porcentaje_completado: porcentaje,
      })

      setSuccess('Entrevista creada exitosamente')
      setTimeout(() => {
        router.push('/entrevistas')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al crear la entrevista')
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nueva Entrevista - Influencia Familiar y Educativa
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Objetivo: Conocer relación familiar y educativa en los estudiantes de la I.E. N°11017 – Nicolas la Torre García
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
          {/* Datos del Estudiante */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Datos del Estudiante
            </h3>

            <div className="space-y-4">
              {/* Buscador de estudiantes */}
              <StudentSelector
                onStudentSelect={setSelectedStudent}
                selectedStudent={selectedStudent}
                label="Buscar Estudiante por Nombre o Apellido"
                placeholder="Escribe para buscar..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Grado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: 5to Primaria"
                    required
                  />
                </div>

                {/* Aula */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={aula}
                    onChange={(e) => setAula(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: A, B, C"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preguntas de la Entrevista */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Preguntas de la Entrevista
            </h3>

            <div className="space-y-6">
              {/* Pregunta 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  1. ¿Con quienes vives en casa?
                </label>
                <textarea
                  value={pregunta1}
                  onChange={(e) => setPregunta1(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe con quienes vives..."
                />
              </div>

              {/* Pregunta 2 */}
              <div>
                <label htmlFor="pregunta2-opcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  2. ¿Cómo es la relación con las personas con las que vives en casa?
                </label>
                <div className="space-y-3">
                  <select
                    id="pregunta2-opcion"
                    value={pregunta2Opcion}
                    onChange={(e) => setPregunta2Opcion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="a">a) Muy buena</option>
                    <option value="b">b) Buena</option>
                    <option value="c">c) Regular</option>
                    <option value="d">d) Mala</option>
                    <option value="e">e) Muy mala</option>
                  </select>
                  <div>
                    <label htmlFor="pregunta2-porque" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      ¿Por qué?
                    </label>
                    <textarea
                      id="pregunta2-porque"
                      value={pregunta2Porque}
                      onChange={(e) => setPregunta2Porque(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Explica por qué..."
                    />
                  </div>
                </div>
              </div>

              {/* Pregunta 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  3. ¿Con qué integrante de tu familia tiene más confianza para contarle cómo te sientes?
                </label>
                <textarea
                  value={pregunta3}
                  onChange={(e) => setPregunta3(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  4. ¿Hay alguna persona en tu familia con la que te cueste trabajo hablar o compartir tus sentimientos?
                </label>
                <textarea
                  value={pregunta4}
                  onChange={(e) => setPregunta4(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 5 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  5. ¿Sientes que el ambiente en el salón de clases es respetuoso y acogedor para todos?
                </label>
                <textarea
                  value={pregunta5}
                  onChange={(e) => setPregunta5(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 6 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  6. ¿Hay algún lugar o momento durante la clase en el que te sientas incómodo?
                </label>
                <textarea
                  value={pregunta6}
                  onChange={(e) => setPregunta6(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 7 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  7. ¿Hay algún compañero con el que se te haga difícil trabajar o llevarte bien?
                </label>
                <textarea
                  value={pregunta7}
                  onChange={(e) => setPregunta7(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 8 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  8. ¿Qué es lo que más te gusta del grupo de amigos de tu salón?
                </label>
                <textarea
                  value={pregunta8}
                  onChange={(e) => setPregunta8(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 9 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  9. Cuando trabajan en equipo, ¿sientes que todos colaboran y hacen su parte?
                </label>
                <textarea
                  value={pregunta9}
                  onChange={(e) => setPregunta9(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>

              {/* Pregunta 10 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  10. ¿Hay algún tema o actividad que te parezca confuso o difícil de entender?
                </label>
                <textarea
                  value={pregunta10}
                  onChange={(e) => setPregunta10(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Responde aquí..."
                />
              </div>
            </div>

            {/* Mensaje de agradecimiento */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
              <p className="text-green-800 dark:text-green-200 font-medium">
                ¡MUCHAS GRACIAS POR SU PARTICIPACIÓN!
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/entrevistas')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Entrevista'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
