'use client'

// app/fichas-sociales/[id]/page.tsx
// Página para ver los detalles completos de una Ficha Social

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FichaSocialService } from '@/services/FichaSocialService'
import type { FichaSocial } from '@/types'
import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import ErrorAlert from '@/components/ErrorAlert'

export default function FichaSocialDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [ficha, setFicha] = useState<FichaSocial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fichaId = params?.id as string

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchFicha = async () => {
      if (!fichaId) return

      try {
        setLoading(true)
        const data = await FichaSocialService.getFichaById(fichaId)
        setFicha(data)
      } catch (err: any) {
        console.error('Error al cargar ficha:', err)
        setError(err.message || 'Error al cargar la ficha social')
      } finally {
        setLoading(false)
      }
    }

    if (fichaId) {
      fetchFicha()
    }
  }, [fichaId])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !ficha) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error || 'Ficha no encontrada'} />
          <Button onClick={() => router.push('/fichas-sociales')}>
            Volver al listado
          </Button>
        </main>
      </div>
    )
  }

  // Calcular porcentaje correcto en lugar de usar el del backend
  const porcentajeCorrecto = FichaSocialService.calcularPorcentajeCompletado(ficha);

  const totales = ficha.datos_economicos ? {
    ingresos: (ficha.datos_economicos.ingresos?.trabajador || 0) +
              (ficha.datos_economicos.ingresos?.conyuge || 0) +
              (ficha.datos_economicos.ingresos?.otros || 0),
    egresos: Object.values(ficha.datos_economicos.egresos?.servicios_basicos || {}).reduce((sum, val) => sum + (val || 0), 0) +
             Object.values(ficha.datos_economicos.egresos?.gastos_familiares || {}).reduce((sum, val) => sum + (val || 0), 0) +
             Object.values(ficha.datos_economicos.egresos?.deudas_seguros || {}).reduce((sum, val) => sum + (val || 0), 0)
  } : { ingresos: 0, egresos: 0 }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Ficha Social
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {`${ficha.apellido_paterno || ''} ${ficha.apellido_materno || ''}`.trim() || 'N/A'} {ficha.nombres || ''}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/fichas-sociales/${fichaId}/pdf`)}
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </Button>
            <Button onClick={() => router.push(`/fichas-sociales/${fichaId}/editar`)}>
              Editar
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/fichas-sociales')}
            >
              Volver
            </Button>
          </div>
        </div>

        {/* Estado y Progreso */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                porcentajeCorrecto === 100 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                porcentajeCorrecto >= 80 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {porcentajeCorrecto === 100 ? 'COMPLETA' : porcentajeCorrecto >= 80 ? 'CASI COMPLETA' : 'INCOMPLETA'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progreso</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mr-3">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full"
                    style={{ width: `${porcentajeCorrecto}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {porcentajeCorrecto}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fecha de Creación</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(ficha.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Sección 1: Datos del Estudiante */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Datos del Estudiante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField label="Apellidos" value={`${ficha.apellido_paterno || ''} ${ficha.apellido_materno || ''}`.trim() || 'N/A'} />
            <InfoField label="Nombres" value={ficha.nombres} />
            <InfoField label="Sexo" value={ficha.sexo === 'M' ? 'Masculino' : 'Femenino'} />
            <InfoField label="Fecha de Nacimiento" value={formatDate(ficha.fecha_nacimiento)} />
            <InfoField label="Edad" value={ficha.edad?.toString() || 'N/A'} />
            <InfoField label="Nacionalidad" value={ficha.nacionalidad} />
            <InfoField label={ficha.nacionalidad === 'Peruana' ? 'DNI' : 'Carné de Extranjería'}
                      value={ficha.dni || ficha.carne_extranjeria || 'N/A'} />
            <InfoField label="Grado" value={ficha.grado || 'N/A'} />
            <InfoField label="Sección" value={ficha.seccion || 'N/A'} />
            <InfoField label="Estado Civil" value={ficha.estado_civil || 'N/A'} />
            <InfoField label="Número de Hijos" value={ficha.num_hijos?.toString() || '0'} />
            <InfoField label="Domicilio Actual" value={ficha.domicilio_actual || 'N/A'} className="md:col-span-2" />
            <InfoField label="Distrito" value={ficha.distrito || 'N/A'} />
          </div>
        </div>

        {/* Sección 2: Composición Familiar */}
        {ficha.composicion_familiar && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Composición Familiar
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                Datos del Padre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Apellido Paterno" value={ficha.composicion_familiar.padre.apellido_paterno} />
                <InfoField label="Apellido Materno" value={ficha.composicion_familiar.padre.apellido_materno} />
                <InfoField label="Nombres" value={ficha.composicion_familiar.padre.nombres} />
                <InfoField label="Edad" value={ficha.composicion_familiar.padre.edad?.toString() || 'N/A'} />
                <InfoField label="Ocupación" value={ficha.composicion_familiar.padre.ocupacion} />
                <InfoField label="Centro Laboral" value={ficha.composicion_familiar.padre.centro_laboral || 'N/A'} />
                <InfoField label="Celular" value={ficha.composicion_familiar.padre.celular} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-pink-900 dark:text-pink-100 mb-3 bg-pink-50 dark:bg-pink-900/30 p-2 rounded">
                Datos de la Madre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Apellido Paterno" value={ficha.composicion_familiar.madre.apellido_paterno} />
                <InfoField label="Apellido Materno" value={ficha.composicion_familiar.madre.apellido_materno} />
                <InfoField label="Nombres" value={ficha.composicion_familiar.madre.nombres} />
                <InfoField label="Edad" value={ficha.composicion_familiar.madre.edad?.toString() || 'N/A'} />
                <InfoField label="Ocupación" value={ficha.composicion_familiar.madre.ocupacion} />
                <InfoField label="Centro Laboral" value={ficha.composicion_familiar.madre.centro_laboral || 'N/A'} />
                <InfoField label="Celular" value={ficha.composicion_familiar.madre.celular} />
              </div>
            </div>
          </div>
        )}

        {/* Sección 3: Situación Económica */}
        {ficha.datos_economicos && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Situación Económica
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-3 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                Ingresos Mensuales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Ingreso del Trabajador" value={formatCurrency(ficha.datos_economicos.ingresos.trabajador)} />
                <InfoField label="Ingreso del Cónyuge" value={formatCurrency(ficha.datos_economicos.ingresos.conyuge)} />
                <InfoField label="Otros Ingresos" value={formatCurrency(ficha.datos_economicos.ingresos.otros)} />
              </div>
              <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Total Ingresos: {formatCurrency(totales.ingresos)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-3 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                Egresos Mensuales
              </h3>

              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Servicios Básicos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <InfoField label="Agua" value={formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.agua)} />
                <InfoField label="Luz" value={formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.luz)} />
                <InfoField label="Teléfono" value={formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.telefono)} />
                <InfoField label="Internet" value={formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.internet)} />
                <InfoField label="Cable" value={formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.cable)} />
              </div>

              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Gastos Familiares</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <InfoField label="Alimentación" value={formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.alimentacion)} />
                <InfoField label="Educación" value={formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.educacion)} />
                <InfoField label="Salud" value={formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.salud)} />
                <InfoField label="Transporte" value={formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.transporte)} />
                <InfoField label="Vestimenta" value={formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.vestimenta)} />
              </div>

              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Deudas y Seguros</h4>
              <div className="grid grid-cols-2 gap-3">
                <InfoField label="Préstamos" value={formatCurrency(ficha.datos_economicos.egresos.deudas_seguros.prestamos)} />
                <InfoField label="Seguros" value={formatCurrency(ficha.datos_economicos.egresos.deudas_seguros.seguros)} />
              </div>

              <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Total Egresos: {formatCurrency(totales.egresos)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Ingresos</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totales.ingresos)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Egresos</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totales.egresos)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Balance</p>
                  <p className={`text-lg font-bold ${totales.ingresos - totales.egresos >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {formatCurrency(totales.ingresos - totales.egresos)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección 4: Vivienda y Salud */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Vivienda */}
          {ficha.datos_vivienda && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Datos de Vivienda
              </h2>
              <InfoField label="Tipo de Vivienda" value={ficha.datos_vivienda.tipo_vivienda || 'N/A'} className="mb-3" />

              {ficha.datos_vivienda.material && ficha.datos_vivienda.material.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material de Construcción</p>
                  <div className="flex flex-wrap gap-2">
                    {ficha.datos_vivienda.material.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ficha.datos_vivienda.tenencia && ficha.datos_vivienda.tenencia.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenencia</p>
                  <div className="flex flex-wrap gap-2">
                    {ficha.datos_vivienda.tenencia.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ficha.datos_vivienda.servicios && ficha.datos_vivienda.servicios.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Servicios Básicos</p>
                  <div className="flex flex-wrap gap-2">
                    {ficha.datos_vivienda.servicios.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ficha.datos_vivienda.problemas_sociales && ficha.datos_vivienda.problemas_sociales.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problemas Sociales</p>
                  <div className="flex flex-wrap gap-2">
                    {ficha.datos_vivienda.problemas_sociales.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Salud */}
          {ficha.datos_salud && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Datos de Salud
              </h2>
              <InfoField label="Tipo de Seguro" value={ficha.datos_salud.tipo_seguro || 'N/A'} className="mb-3" />
              <InfoField label="Grupo Sanguíneo" value={ficha.datos_salud.grupo_sanguineo || 'N/A'} className="mb-3" />

              {ficha.datos_salud.alergias?.tiene && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alergias</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded">
                    {ficha.datos_salud.alergias.especificar || 'Sin especificar'}
                  </p>
                </div>
              )}

              {ficha.datos_salud.enfermedades?.tiene && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enfermedades Crónicas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                    {ficha.datos_salud.enfermedades.especificar || 'Sin especificar'}
                  </p>
                </div>
              )}

              {ficha.datos_salud.discapacidad?.tiene && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discapacidad</p>
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Tipo:</strong> {ficha.datos_salud.discapacidad.tipo || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Grado:</strong> {ficha.datos_salud.discapacidad.grado || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección 5: Declaración Jurada */}
        {ficha.declaracion_jurada && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Declaración Jurada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InfoField label="Nombre del Firmante" value={ficha.declaracion_jurada.nombre_firmante} className="mb-3" />
                <InfoField
                  label="Términos Aceptados"
                  value={ficha.declaracion_jurada.acepta_terminos ? 'Sí' : 'No'}
                  className="mb-3"
                />
                {ficha.declaracion_jurada.fecha_firma && (
                  <InfoField
                    label="Fecha de Firma"
                    value={formatDate(ficha.declaracion_jurada.fecha_firma)}
                  />
                )}
              </div>
              {ficha.declaracion_jurada.firma_digital && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Firma Digital</p>
                  <div className="border-2 border-gray-200 dark:border-gray-600 rounded p-2 bg-gray-50 dark:bg-gray-700">
                    <img
                      src={ficha.declaracion_jurada.firma_digital}
                      alt="Firma Digital"
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Componente auxiliar para mostrar campos de información
function InfoField({
  label,
  value,
  className = ''
}: {
  label: string
  value?: string | number | null | undefined
  className?: string
}) {
  const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : 'N/A'

  return (
    <div className={className}>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{displayValue}</p>
    </div>
  )
}
