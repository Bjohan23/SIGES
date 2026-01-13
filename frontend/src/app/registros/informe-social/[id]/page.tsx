'use client'

// app/registros/informe-social/[id]/page.tsx
// Página de detalles de Informe Social

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { InformeSocialService } from '@/services/InformeSocialService'
import type { InformeSocial } from '@/services/InformeSocialService'

export default function InformeSocialDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [informe, setInforme] = useState<InformeSocial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    } catch (err: any) {
      setError(err.message || 'Error al cargar el informe social')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!informe) return

    if (confirm('¿Está seguro de que desea eliminar este informe social?')) {
      try {
        await InformeSocialService.deleteInformeSocial(informe.id)
        setSuccess('Informe social eliminado exitosamente')
        setTimeout(() => {
          router.push('/registros/informe-social')
        }, 1500)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el informe social')
      }
    }
  }

  const handlePrintPDF = () => {
    if (!informe) return

    try {
      const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A'
        return new Date(dateStr).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }

      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Informe Social - ${informe.nombres_apellidos || 'N/A'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              margin: 20px;
              padding: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              font-size: 18px;
              margin: 0;
              color: #333;
            }
            .header p {
              font-size: 14px;
              margin: 5px 0 0 0;
              color: #666;
            }
            .section {
              margin-bottom: 25px;
            }
            .section h3 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .section-content {
              margin-bottom: 10px;
            }
            .field {
              margin-bottom: 8px;
            }
            .field-label {
              font-weight: bold;
              color: #555;
            }
            .field-value {
              color: #000;
            }
            .text-content {
              white-space: pre-wrap;
              background: #f9f9f9;
              padding: 10px;
              border-left: 3px solid #ddd;
              margin: 10px 0;
            }
            .signature-section {
              margin-top: 60px;
              page-break-inside: avoid;
            }
            .signature-line {
              margin-top: 80px;
              border-top: 1px solid #000;
              width: 300px;
              text-align: center;
              padding-top: 10px;
              font-size: 11px;
              color: #666;
            }
            .signature-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-top: 60px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ccc;
              font-size: 10px;
              color: #999;
              text-align: center;
            }
            @media print {
              body { margin: 10mm; }
              .signature-section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INFORME SOCIAL</h1>
            <p>Fecha de emisión: ${formatDate(informe.created_at)}</p>
          </div>

          <div class="section">
            <h3>I. DATOS GENERALES</h3>
            <div class="section-content">
              <div class="field">
                <span class="field-label">Nombres y Apellidos:</span>
                <span class="field-value">${informe.nombres_apellidos || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Edad:</span>
                <span class="field-value">${informe.edad ? informe.edad + ' años' : 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Estado Civil:</span>
                <span class="field-value">${informe.estado_civil || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Grado de Instrucción:</span>
                <span class="field-value">${informe.grado_instruccion || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Dirección:</span>
                <span class="field-value">${informe.direccion || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Motivo:</span>
                <span class="field-value">${informe.motivo || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>II. SITUACIÓN FAMILIAR</h3>
            <div class="text-content">${informe.situacion_familiar || 'Sin información'}</div>
          </div>

          <div class="section">
            <h3>III. SITUACIÓN ECONÓMICA</h3>
            <div class="text-content">${informe.situacion_economica || 'Sin información'}</div>
          </div>

          <div class="section">
            <h3>IV. VIVIENDA</h3>
            <div class="text-content">${informe.vivienda || 'Sin información'}</div>
          </div>

          <div class="section">
            <h3>V. EDUCACIÓN</h3>
            <div class="text-content">${informe.educacion || 'Sin información'}</div>
          </div>

          <div class="section">
            <h3>VI. PROBLEMA SOCIAL</h3>
            <div class="text-content">${informe.problema_social || 'Sin información'}</div>
          </div>

          <div class="section">
            <h3>VII. APRECIACIÓN PROFESIONAL</h3>
            <div class="section-content">
              <div class="field">
                <span class="field-label">Apreciación:</span>
              </div>
              <div class="text-content">${informe.apreciacion_profesional || 'N/A'}</div>
              <div class="field">
                <span class="field-label">Lugar:</span>
                <span class="field-value">${informe.lugar || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Fecha:</span>
                <span class="field-value">${informe.fecha ? formatDate(informe.fecha) : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-grid">
              <div>
                <div class="signature-line">Trabajador(a) Social</div>
              </div>
              <div>
                <div class="signature-line">Firma del Beneficiario(a)</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Documento generado el ${new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </body>
        </html>
      `

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(content)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 500)
      }
    } catch (err) {
      console.error('Error al generar PDF:', err)
      setError('Error al generar el PDF')
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              type="button"
              onClick={() => router.push('/registros/informe-social')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle del Informe Social
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Informe social completo
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => router.push(`/registros/informe-social/${informe?.id}/editar`)}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
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

        {informe && (
          <div className="space-y-6">
            {/* I. Datos Generales */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                I. Datos Generales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombres y Apellidos:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {informe.nombres_apellidos || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Edad:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{informe.edad || 'N/A'} años</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estado Civil:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{informe.estado_civil || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grado de Instrucción:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{informe.grado_instruccion || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dirección:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{informe.direccion || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Motivo:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{informe.motivo || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* II. Situación Familiar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                II. Situación Familiar
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {typeof informe.situacion_familiar === 'string'
                  ? informe.situacion_familiar
                  : JSON.stringify(informe.situacion_familiar, null, 2) || 'Sin información'}
              </p>
            </div>

            {/* III. Situación Económica */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                III. Situación Económica
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {typeof informe.situacion_economica === 'string'
                  ? informe.situacion_economica
                  : JSON.stringify(informe.situacion_economica, null, 2) || 'Sin información'}
              </p>
            </div>

            {/* IV. Vivienda */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                IV. Vivienda
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {typeof informe.vivienda === 'string'
                  ? informe.vivienda
                  : JSON.stringify(informe.vivienda, null, 2) || 'Sin información'}
              </p>
            </div>

            {/* V. Educación */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                V. Educación
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {typeof informe.educacion === 'string'
                  ? informe.educacion
                  : JSON.stringify(informe.educacion, null, 2) || 'Sin información'}
              </p>
            </div>

            {/* VI. Problema Social */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                VI. Problema Social
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {typeof informe.problema_social === 'string'
                  ? informe.problema_social
                  : JSON.stringify(informe.problema_social, null, 2) || 'Sin información'}
              </p>
            </div>

            {/* VII. Apreciación Profesional */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                VII. Apreciación Profesional
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Apreciación:</span>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg mt-1 whitespace-pre-wrap">
                    {informe.apreciacion_profesional || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lugar:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{informe.lugar || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {informe.fecha ? new Date(informe.fecha).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Información del Registro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de creación:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(informe.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última actualización:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(informe.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {informe.creador && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creado por:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {informe.creador.nombres} {informe.creador.apellidos}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
