'use client'

// app/registros/registro-visita-domiciliaria/[id]/page.tsx
// Página de detalles de Registro de Visita Domiciliaria

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { RegistroVisitaDomiciliariaService } from '@/services/RegistroVisitaDomiciliariaService'
import type { RegistroVisitaDomiciliaria } from '@/services/RegistroVisitaDomiciliariaService'

export default function RegistroVisitaDomiciliariaDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [registro, setRegistro] = useState<RegistroVisitaDomiciliaria | null>(null)
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
      loadRegistro(params.id as string)
    }
  }, [params.id, user])

  const loadRegistro = async (id: string) => {
    try {
      setLoading(true)
      const data = await RegistroVisitaDomiciliariaService.getRegistroVisitaDomiciliariaById(id)
      setRegistro(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar el registro de visita domiciliaria')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!registro) return

    if (confirm('¿Está seguro de que desea eliminar este registro de visita domiciliaria?')) {
      try {
        await RegistroVisitaDomiciliariaService.deleteRegistroVisitaDomiciliaria(registro.id)
        setSuccess('Registro de visita domiciliaria eliminado exitosamente')
        setTimeout(() => {
          router.push('/registros/registro-visita-domiciliaria')
        }, 1500)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el registro de visita domiciliaria')
      }
    }
  }

  const handlePrintPDF = () => {
    if (!registro) return

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
          <title>Registro de Visita Domiciliaria - ${registro.nombre_entrevistado || 'N/A'}</title>
          <style>
            /* Reset and base styles */
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

            /* Top border line */
            .top-border {
              border-top: 2px solid #000;
              margin-bottom: 20px;
            }

            /* Header section */
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

            /* Section styles */
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

            /* Data grid - compact layout */
            .data-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px 20px;
              margin-bottom: 10px;
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

            /* Relato section with border */
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

            /* Signature section */
            .signature-section {
              margin-top: 50px;
              page-break-inside: avoid;
            }

            .signature-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 60px;
            }

            .signature-item {
              text-align: center;
            }

            .signature-space {
              height: 60px;
              border-bottom: 1px solid #000;
              margin-bottom: 8px;
            }

            .signature-label {
              font-size: 9pt;
              font-weight: bold;
              color: #000;
            }

            /* Footer */
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

            /* Print optimization */
            @media print {
              body {
                margin: 10mm 15mm;
              }
              .section,
              .relato-box,
              .signature-section {
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
            <h1>REGISTRO DE VISITA DOMICILIARIA</h1>
            <p>Fecha de emisión: ${formatDate(registro.created_at)}</p>
          </div>

          <div class="section">
            <h3>I. DATOS GENERALES</h3>
            <div class="data-grid">
              <div class="field">
                <span class="field-label">Nombre:</span>
                <span class="field-value">${registro.nombre_entrevistado || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Domicilio:</span>
                <span class="field-value">${registro.domicilio || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Fecha Visita:</span>
                <span class="field-value">${registro.fecha_visita ? formatDate(registro.fecha_visita) : 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Responsable:</span>
                <span class="field-value">${registro.responsable || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>II. OBJETIVO</h3>
            <div class="relato-box">
              <div class="relato-content">${registro.objetivo || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>III. RELATO</h3>
            <div class="relato-box">
              <div class="relato-content">${registro.relato || 'Sin información'}</div>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-grid">
              <div class="signature-item">
                <div class="signature-space"></div>
                <div class="signature-label">RESPONSABLE</div>
              </div>
              <div class="signature-item">
                <div class="signature-space"></div>
                <div class="signature-label">ENTREVISTADO</div>
              </div>
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

  if (error && !registro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/registro-visita-domiciliaria')}
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
              onClick={() => router.push('/registros/registro-visita-domiciliaria')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle del Registro de Visita Domiciliaria
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Información completa del registro
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
              onClick={() => router.push(`/registros/registro-visita-domiciliaria/${registro?.id}/editar`)}
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

        {registro && (
          <div className="space-y-6">
            {/* I. Datos Generales */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                I. DATOS GENERALES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre del Entrevistado:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.nombre_entrevistado || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Domicilio:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.domicilio || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de Visita:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {registro.fecha_visita ? new Date(registro.fecha_visita).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Responsable:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.responsable || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* II. Objetivo */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                II. OBJETIVO
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {registro.objetivo || 'Sin información'}
              </p>
            </div>

            {/* III. Relato */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                III. RELATO
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {registro.relato || 'Sin información'}
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
                    {new Date(registro.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última actualización:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(registro.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {registro.creador && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creado por:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {registro.creador.nombres} {registro.creador.apellidos}
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
