'use client'

// app/fichas-sociales/[id]/detail/page.tsx
// Vista alternativa para ver los detalles completos de una Ficha Social

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FichaSocialService } from '@/services/FichaSocialService'
import type { FichaSocial } from '@/types'
import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import ErrorAlert from '@/components/ErrorAlert'

export default function FichaSocialDetailAlternativePage() {
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
        console.log('🔄 Cargando ficha:', fichaId)
        const data = await FichaSocialService.getFichaById(fichaId)
        console.log('✅ Ficha cargada:', data)
        setFicha(data)
      } catch (err: any) {
        console.error('❌ Error al cargar ficha:', err)
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
    }).format(value || 0)
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
              Detalles de Ficha Social
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {ficha.apellidos || `${ficha.apellido_paterno || ''} ${ficha.apellido_materno || ''}`.trim()} {ficha.nombres}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/fichas-sociales/${fichaId}/editar`)}
            >
              ✏️ Editar
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/fichas-sociales/${fichaId}/pdf`)}
            >
              📄 Descargar PDF
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
                ficha.estado === 'COMPLETA' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                ficha.estado === 'INCOMPLETA' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {ficha.estado}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progreso</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mr-3">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full"
                    style={{ width: `${ficha.porcentaje_completado}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {ficha.porcentaje_completado}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Edad</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {ficha.edad ? `${ficha.edad} años` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Sección 1: Datos Personales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            👤 Datos Personales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoField label="Nombres" value={ficha.nombres || 'N/A'} />
            <InfoField label="Apellido Paterno" value={ficha.apellido_paterno || 'N/A'} />
            <InfoField label="Apellido Materno" value={ficha.apellido_materno || 'N/A'} />
            <InfoField label="Sexo" value={ficha.sexo === 'M' ? 'Masculino' : 'Femenino'} />
            <InfoField label="Fecha de Nacimiento" value={ficha.fecha_nacimiento ? formatDate(ficha.fecha_nacimiento) : 'N/A'} />
            <InfoField label="Edad" value={ficha.edad?.toString() || 'N/A'} />
            <InfoField label="Nacionalidad" value={ficha.nacionalidad || 'N/A'} />
            <InfoField label="DNI" value={ficha.dni || 'N/A'} />
            <InfoField label="Carné de Extranjería" value={ficha.carne_extranjeria || 'N/A'} />
            <InfoField label="Nivel Educativo" value={ficha.nivel_educativo || 'N/A'} />
            <InfoField label="Estado Civil" value={ficha.estado_civil || 'N/A'} />
            <InfoField label="Número de Hijos" value={ficha.num_hijos?.toString() || '0'} />
            <InfoField label="Domicilio" value={ficha.domicilio_actual || 'N/A'} />
            <InfoField label="Distrito" value={ficha.distrito || 'N/A'} />
          </div>
        </div>

        {/* Sección 2: Datos Económicos */}
        {ficha.datos_economicos && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              💰 Situación Económica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ingresos */}
              <div>
                <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-3">Ingresos Mensuales</h3>
                <div className="space-y-2">
                  <InfoField label="Trabajador" value={formatCurrency(ficha.datos_economicos.ingresos?.trabajador)} />
                  <InfoField label="Cónyuge" value={formatCurrency(ficha.datos_economicos.ingresos?.conyuge)} />
                  <InfoField label="Otros" value={formatCurrency(ficha.datos_economicos.ingresos?.otros)} />
                  <div className="pt-2 border-t border-green-200 dark:border-green-800">
                    <InfoField label="Total Ingresos" value={formatCurrency(totales.ingresos)} className="font-bold text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Egresos */}
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-3">Egresos Mensuales</h3>
                <div className="space-y-2">
                  <InfoField label="Total Egresos" value={formatCurrency(totales.egresos)} className="font-bold text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Ingresos</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totales.ingresos)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Egresos</p>
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

        {/* Más secciones según sea necesario... */}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Creado: {formatDate(ficha.created_at)} por {ficha.creador?.nombres} {ficha.creador?.apellidos}</p>
          {ficha.updated_at && (
            <p>Actualizado: {formatDate(ficha.updated_at)} por {ficha.actualizador?.nombres} {ficha.actualizador?.apellidos}</p>
          )}
        </div>
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
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{value}</p>
    </div>
  )
}
