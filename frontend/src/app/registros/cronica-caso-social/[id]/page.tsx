'use client'

// app/registros/cronica-caso-social/[id]/page.tsx
// Página de detalles de Crónica de Caso Social

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { CronicaCasoSocialService } from '@/services/CronicaCasoSocialService'
import type { CronicaCasoSocial } from '@/services/CronicaCasoSocialService'

export default function CronicaCasoSocialDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [cronica, setCronica] = useState<CronicaCasoSocial | null>(null)
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
      loadCronica(params.id as string)
    }
  }, [params.id, user])

  const loadCronica = async (id: string) => {
    try {
      setLoading(true)
      const data = await CronicaCasoSocialService.getCronicaCasoSocialById(id)
      setCronica(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar la crónica de caso social')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!cronica) return

    if (confirm('¿Está seguro de que desea eliminar esta crónica de caso social?')) {
      try {
        await CronicaCasoSocialService.deleteCronicaCasoSocial(cronica.id)
        setSuccess('Crónica de caso social eliminada exitosamente')
        setTimeout(() => {
          router.push('/registros/cronica-caso-social')
        }, 1500)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la crónica de caso social')
      }
    }
  }

  const handlePrintPDF = () => {
    if (!cronica) return

    try {
      const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A'
        return new Date(dateStr).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }

      const formatDateTime = (dateStr: string) => {
        if (!dateStr) return 'N/A'
        return new Date(dateStr).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      }

      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Crónica de Caso Social - ${cronica.nombres_apellidos || 'N/A'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 11pt;
              line-height: 1.3;
              color: #000;
              background: #fff;
              margin: 15mm 20mm;
              padding: 0;
            }

            .top-border {
              border-top: 2px solid #000;
              margin-bottom: 20px;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
            }

            .header h1 {
              font-size: 16pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0 0 8px 0;
              color: #000;
            }

            .header p {
              font-size: 9pt;
              font-style: italic;
              color: #000;
              margin: 0;
            }

            .section {
              margin-bottom: 20px;
            }

            .section h3 {
              font-size: 11pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 12px;
              padding-bottom: 4px;
              border-bottom: 1px solid #000;
              color: #000;
            }

            .data-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px 20px;
              margin-bottom: 10px;
            }

            .data-grid.full-width {
              grid-template-columns: 1fr;
            }

            .field {
              display: flex;
              gap: 4px;
            }

            .field-label {
              font-weight: bold;
              font-size: 10pt;
              color: #000;
              white-space: nowrap;
              min-width: 90px;
            }

            .field-value {
              font-size: 10pt;
              color: #000;
              flex: 1;
            }

            .relato-box {
              border: 1px solid #000;
              padding: 12px;
              min-height: 120px;
              page-break-inside: avoid;
            }

            .relato-content {
              text-align: justify;
              font-size: 10pt;
              line-height: 1.5;
              white-space: pre-wrap;
              color: #000;
            }

            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
              text-align: center;
              page-break-inside: avoid;
            }

            .footer p {
              font-size: 8pt;
              font-style: italic;
              color: #000;
              margin: 0;
            }

            @media print {
              body {
                margin: 10mm 15mm;
              }
              .section,
              .relato-box {
                page-break-inside: avoid;
              }
              @page {
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="top-border"></div>

          <div class="header">
            <h1>CRÓNICA DE CASO SOCIAL</h1>
            <p>Fecha de emisión: ${formatDate(cronica.created_at)}</p>
          </div>

          <div class="section">
            <h3>I. DATOS GENERALES</h3>
            <div class="data-grid">
              <div class="field">
                <span class="field-label">Nº Reunión:</span>
                <span class="field-value">${cronica.num_reunion || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Fecha y hora:</span>
                <span class="field-value">${formatDateTime(cronica.fecha_hora || '')}</span>
              </div>
              <div class="field full-width">
                <span class="field-label">Nombres:</span>
                <span class="field-value">${cronica.nombres_apellidos || 'N/A'}</span>
              </div>
              <div class="field full-width">
                <span class="field-label">Asistentes:</span>
                <span class="field-value">${cronica.asistentes || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>II. ACTIVIDADES REALIZADAS</h3>
            <div class="relato-box">
              <div class="relato-content">${cronica.actividades_realizadas || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>III. PROGRAMAS A REALIZARSE</h3>
            <div class="relato-box">
              <div class="relato-content">${cronica.programas || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>IV. RELATO</h3>
            <div class="relato-box">
              <div class="relato-content">${cronica.relato || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>V. INTERPRETACIÓN</h3>
            <div class="relato-box">
              <div class="relato-content">${cronica.interpretacion || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>VI. SUGERENCIAS</h3>
            <div class="relato-box">
              <div class="relato-content">${cronica.sugerencias || 'Sin información'}</div>
            </div>
          </div>

          <div class="footer">
            <p>Documento confidencial de Trabajo Social. Su reproducción no autorizada está prohibida.</p>
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

  if (error && !cronica) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/cronica-caso-social')}
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              type="button"
              onClick={() => router.push('/registros/cronica-caso-social')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle de Crónica de Caso Social
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Información completa de la crónica
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
              onClick={() => router.push(`/registros/cronica-caso-social/${cronica?.id}/editar`)}
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

        {cronica && (
          <div className="space-y-6">
            {/* I. Datos Generales */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                I. DATOS GENERALES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nº de Reunión:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{cronica.num_reunion || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha y Hora:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {cronica.fecha_hora ? new Date(cronica.fecha_hora).toLocaleString('es-ES') : 'N/A'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombres y Apellidos:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{cronica.nombres_apellidos || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Asistentes:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{cronica.asistentes || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* II. Actividades Realizadas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                II. ACTIVIDADES REALIZADAS
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {cronica.actividades_realizadas || 'Sin información'}
              </p>
            </div>

            {/* III. Programas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                III. PROGRAMAS A REALIZARSE
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {cronica.programas || 'Sin información'}
              </p>
            </div>

            {/* IV. Relato */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                IV. RELATO
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {cronica.relato || 'Sin información'}
              </p>
            </div>

            {/* V. Interpretación */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                V. INTERPRETACIÓN
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {cronica.interpretacion || 'Sin información'}
              </p>
            </div>

            {/* VI. Sugerencias */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                VI. SUGERENCIAS
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {cronica.sugerencias || 'Sin información'}
              </p>
            </div>

            {/* Información del registro */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Información del Registro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de creación:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(cronica.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última actualización:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(cronica.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {cronica.creador && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creado por:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {cronica.creador.nombres} {cronica.creador.apellidos}
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
