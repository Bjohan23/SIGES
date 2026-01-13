'use client'

// app/registros/situacion-socio-familiar/[id]/page.tsx
// Página de detalles de Situación Socio Familiar

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { SituacionSocioFamiliarService } from '@/services/SituacionSocioFamiliarService'
import type { SituacionSocioFamiliar } from '@/services/SituacionSocioFamiliarService'

export default function SituacionSocioFamiliarDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [situacion, setSituacion] = useState<SituacionSocioFamiliar | null>(null)
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
      loadSituacion(params.id as string)
    }
  }, [params.id, user])

  const loadSituacion = async (id: string) => {
    try {
      setLoading(true)
      const data = await SituacionSocioFamiliarService.getSituacionSocioFamiliarById(id)
      setSituacion(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar la situación socio familiar')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!situacion) return

    if (confirm('¿Está seguro de que desea eliminar esta situación socio familiar?')) {
      try {
        await SituacionSocioFamiliarService.deleteSituacionSocioFamiliar(situacion.id)
        setSuccess('Situación socio familiar eliminada exitosamente')
        setTimeout(() => {
          router.push('/registros/situacion-socio-familiar')
        }, 1500)
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la situación socio familiar')
      }
    }
  }

  const handlePrintPDF = () => {
    if (!situacion) return

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
          <title>Situación Socio Familiar</title>
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

            .relato-box {
              border: 1px solid #000;
              padding: 12px;
              min-height: 120px;
              margin-bottom: 10px;
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
            <h1>SITUACIÓN SOCIO FAMILIAR</h1>
            <p>Fecha de emisión: ${formatDate(situacion.created_at)}</p>
          </div>

          <div class="section">
            <h3>INTERACCIÓN Y UNIDAD FAMILIAR</h3>

            <div class="relato-box">
              <strong>Subsistema Conyugal:</strong>
              <div class="relato-content">${situacion.subsistema_conyugal || 'Sin información'}</div>
            </div>

            <div class="relato-box">
              <strong>Subsistema Paterno Filial:</strong>
              <div class="relato-content">${situacion.subsistema_paterno_fiscal || 'Sin información'}</div>
            </div>

            <div class="relato-box">
              <strong>Subsistema Fraternal:</strong>
              <div class="relato-content">${situacion.subsistema_fraternal || 'Sin información'}</div>
            </div>

            <div class="relato-box">
              <strong>Solidaridad Familiar:</strong>
              <div class="relato-content">${situacion.solidaridad_familiar || 'Sin información'}</div>
            </div>

            <div class="relato-box">
              <strong>Las Relaciones:</strong>
              <div class="relato-content">${situacion.relaciones || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>DESEMPEÑO DE ROLES DE LOS MIEMBROS</h3>
            <div class="relato-box">
              <div class="relato-content">${situacion.desempeno_roles || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>RELACIONES DE CRIANZA FAMILIAR</h3>
            <div class="relato-box">
              <div class="relato-content">${situacion.relaciones_crianza || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>RELACIONES DE LA FAMILIA CON EL EXOGRUPO</h3>
            <div class="relato-box">
              <div class="relato-content">${situacion.relaciones_exogrupo || 'Sin información'}</div>
            </div>
          </div>

          <div class="section">
            <h3>PAUTAS DE LA VIDA FAMILIAR</h3>
            <div class="relato-box">
              <div class="relato-content">${situacion.pautas_vida_familiar || 'Sin información'}</div>
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

  if (error && !situacion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error} />
          <button
            type="button"
            onClick={() => router.push('/registros/situacion-socio-familiar')}
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
              onClick={() => router.push('/registros/situacion-socio-familiar')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle de Situación Socio Familiar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Información completa de la situación socio familiar
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
              onClick={() => router.push(`/registros/situacion-socio-familiar/${situacion?.id}/editar`)}
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

        {situacion && (
          <div className="space-y-6">
            {/* INTERACCIÓN Y UNIDAD FAMILIAR */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                INTERACCIÓN Y UNIDAD FAMILIAR
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subsistema Conyugal:</span>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap mt-1">
                    {situacion.subsistema_conyugal || 'Sin información'}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subsistema Paterno Filial:</span>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap mt-1">
                    {situacion.subsistema_paterno_fiscal || 'Sin información'}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subsistema Fraternal:</span>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap mt-1">
                    {situacion.subsistema_fraternal || 'Sin información'}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Solidaridad Familiar:</span>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap mt-1">
                    {situacion.solidaridad_familiar || 'Sin información'}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Las Relaciones:</span>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap mt-1">
                    {situacion.relaciones || 'Sin información'}
                  </p>
                </div>
              </div>
            </div>

            {/* DESEMPEÑO DE ROLES */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                DESEMPEÑO DE ROLES DE LOS MIEMBROS
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {situacion.desempeno_roles || 'Sin información'}
              </p>
            </div>

            {/* RELACIONES DE CRIANZA */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                RELACIONES DE CRIANZA FAMILIAR
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {situacion.relaciones_crianza || 'Sin información'}
              </p>
            </div>

            {/* RELACIONES CON EL EXOGRUPO */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                RELACIONES DE LA FAMILIA CON EL EXOGRUPO
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {situacion.relaciones_exogrupo || 'Sin información'}
              </p>
            </div>

            {/* PAUTAS DE VIDA FAMILIAR */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                PAUTAS DE LA VIDA FAMILIAR
              </h3>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-pre-wrap">
                {situacion.pautas_vida_familiar || 'Sin información'}
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
                    {new Date(situacion.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última actualización:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(situacion.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {situacion.creador && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creado por:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {situacion.creador.nombres} {situacion.creador.apellidos}
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
