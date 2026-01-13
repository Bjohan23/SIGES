'use client'

// app/registros/registro-entrevista/[id]/page.tsx
// Página de detalles de Registro de Entrevista

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { RegistroEntrevistaService } from '@/services/RegistroEntrevistaService'
import type { RegistroEntrevista } from '@/services/RegistroEntrevistaService'

export default function RegistroEntrevistaDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [registro, setRegistro] = useState<RegistroEntrevista | null>(null)
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
      const data = await RegistroEntrevistaService.getRegistroEntrevistaById(id)
      setRegistro(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar el registro de entrevista')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!registro) return

    if (confirm('¿Está seguro de que desea eliminar este registro de entrevista?')) {
      try {
        await RegistroEntrevistaService.deleteRegistroEntrevista(registro.id)
        setSuccess('Registro de entrevista eliminado exitosamente')
        setTimeout(() => {
          router.push('/registros/registro-entrevista')
        }, 1500)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el registro de entrevista')
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
          <title>Registro de Entrevista - ${registro.tema || 'N/A'}</title>
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
            <h1>REGISTRO DE ENTREVISTA</h1>
            <p>Fecha de emisión: ${formatDate(registro.created_at)}</p>
          </div>

          <div class="section">
            <h3>DATOS DE LA ENTREVISTA</h3>
            <div class="section-content">
              <div class="field">
                <span class="field-label">Lugar:</span>
                <span class="field-value">${registro.lugar || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Fecha:</span>
                <span class="field-value">${registro.fecha ? formatDate(registro.fecha) : 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Hora:</span>
                <span class="field-value">${registro.hora || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Tema:</span>
                <span class="field-value">${registro.tema || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Objetivo:</span>
                <span class="field-value">${registro.objetivo || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Entrevistado:</span>
                <span class="field-value">${registro.entrevistado || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Entrevistador:</span>
                <span class="field-value">${registro.entrevistador || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>DESCRIPCIÓN Y RELATO</h3>
            <div class="text-content">${registro.descripcion_relato || 'Sin información'}</div>
          </div>

          <div class="signature-section">
            <div class="signature-grid">
              <div>
                <div class="signature-line">Entrevistador</div>
              </div>
              <div>
                <div class="signature-line">Entrevistado</div>
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

  if (error && !registro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/registro-entrevista')}
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
              onClick={() => router.push('/registros/registro-entrevista')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle del Registro de Entrevista
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
              onClick={() => router.push(`/registros/registro-entrevista/${registro?.id}/editar`)}
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
            {/* Datos de la entrevista */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Datos de la Entrevista
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lugar:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.lugar || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Hora:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.hora || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tema:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.tema || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Objetivo:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.objetivo || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Entrevistado:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.entrevistado || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Entrevistador:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{registro.entrevistador || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Descripción y Relato */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Descripción y Relato
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {registro.descripcion_relato || 'Sin información'}
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
