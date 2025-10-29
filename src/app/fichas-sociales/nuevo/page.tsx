'use client'

// app/fichas-sociales/nuevo/page.tsx
// Página para crear nueva Ficha Social - Formulario Multipestañas

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FichaSocialFormProvider, useFichaSocialForm } from '@/context/FichaSocialFormContext'
import { FichaSocialService } from '@/services/FichaSocialService'
import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import ErrorAlert from '@/components/ErrorAlert'

// Importar componentes de pestañas
import DatosEstudianteTab from '@/components/ficha-social-form/DatosEstudianteTab'
import ComposicionFamiliarTab from '@/components/ficha-social-form/ComposicionFamiliarTab'
import SituacionEconomicaTab from '@/components/ficha-social-form/SituacionEconomicaTab'
import ViviendaSaludTab from '@/components/ficha-social-form/ViviendaSaludTab'
import DeclaracionJuradaTab from '@/components/ficha-social-form/DeclaracionJuradaTab'

const STEPS = [
  { id: 0, name: 'Datos del Estudiante', component: DatosEstudianteTab },
  { id: 1, name: 'Composición Familiar', component: ComposicionFamiliarTab },
  { id: 2, name: 'Situación Económica', component: SituacionEconomicaTab },
  { id: 3, name: 'Vivienda y Salud', component: ViviendaSaludTab },
  { id: 4, name: 'Declaración Jurada', component: DeclaracionJuradaTab },
]

function FormContent() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    formData,
    currentStep,
    setCurrentStep,
    validateStep,
    getProgress,
    canProceed,
    resetForm
  } = useFichaSocialForm()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showValidationError, setShowValidationError] = useState(false)

  const progress = getProgress()
  const CurrentTabComponent = STEPS[currentStep].component

  const handleNext = () => {
    setShowValidationError(false)

    // Validar pestaña actual antes de avanzar
    if (!validateStep(currentStep)) {
      setShowValidationError(true)
      setError('Por favor complete todos los campos obligatorios antes de continuar')
      return
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const handlePrevious = () => {
    setShowValidationError(false)
    setError('')
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setShowValidationError(false)
    setError('')

    // Validar la pestaña actual (Declaración Jurada)
    if (!validateStep(currentStep)) {
      setShowValidationError(true)
      setError('Por favor complete todos los campos obligatorios')
      return
    }

    // Verificar que el formulario esté 100% completo
    if (!canProceed()) {
      setError('El formulario no está completo. Por favor revise todas las secciones.')
      return
    }

    try {
      setLoading(true)

      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Preparar datos para enviar
      const fichaData = {
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        nombres: formData.nombres,
        edad: formData.edad,
        sexo: formData.sexo as 'M' | 'F',
        fecha_nacimiento: formData.fecha_nacimiento,
        nacionalidad: formData.nacionalidad,
        dni: formData.dni || undefined,
        carne_extranjeria: formData.carne_extranjeria || undefined,
        grado: formData.grado,
        seccion: formData.seccion,
        nivel_educativo: formData.nivel_educativo || undefined,
        estado_civil: formData.estado_civil as any,
        num_hijos: formData.num_hijos,
        domicilio_actual: formData.domicilio_actual,
        distrito: formData.distrito,
        composicion_familiar: formData.composicion_familiar,
        datos_economicos: formData.datos_economicos,
        datos_vivienda: formData.datos_vivienda,
        datos_salud: formData.datos_salud,
        declaracion_jurada: formData.declaracion_jurada,
      }

      await FichaSocialService.createFicha(fichaData, user.id)

      alert('Ficha social creada exitosamente')
      resetForm()
      router.push('/fichas-sociales')
    } catch (err: any) {
      console.error('Error al guardar:', err)
      setError(err.message || 'Error al crear la ficha social')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nueva Ficha Social</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete todos los campos del formulario. Progreso: {progress}%
          </p>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso del Formulario</span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Navegación de Pestañas */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-2 px-4 overflow-x-auto">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    // Permitir navegar a pestañas anteriores sin validación
                    if (step.id < currentStep) {
                      setCurrentStep(step.id)
                      setError('')
                      setShowValidationError(false)
                    }
                  }}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${isActive
                      ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                      : isCompleted
                      ? 'border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                    ${step.id < currentStep ? 'cursor-pointer' : step.id === currentStep ? 'cursor-default' : 'cursor-not-allowed'}
                  `}
                  disabled={step.id > currentStep}
                >
                  <span className={`
                    mr-2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors
                    ${isActive
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 dark:bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }
                  `}>
                    {isCompleted ? '✓' : step.id + 1}
                  </span>
                  {step.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Contenido de la Pestaña Actual */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
          {error && showValidationError && (
            <div className="mb-6">
              <ErrorAlert message={error} />
            </div>
          )}

          <CurrentTabComponent />
        </div>

        {/* Botones de Navegación */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (confirm('¿Está seguro de cancelar? Se perderán todos los datos ingresados.')) {
                    resetForm()
                    router.push('/fichas-sociales')
                  }
                }}
              >
                Cancelar
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className={!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {loading ? 'Guardando...' : canProceed() ? 'Guardar Ficha Social' : `Completar Formulario (${progress}%)`}
                </Button>
              )}
            </div>
          </div>

          {/* Mensaje informativo si no está completo */}
          {currentStep === STEPS.length - 1 && !canProceed() && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                El formulario está al {progress}% completo. Por favor complete todos los campos obligatorios
                en todas las secciones antes de guardar.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function NuevaFichaSocialPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <FichaSocialFormProvider>
      <FormContent />
    </FichaSocialFormProvider>
  )
}
