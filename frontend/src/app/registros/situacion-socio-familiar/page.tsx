'use client'

// app/registros/situacion-socio-familiar/page.tsx
// Página de listado de Situaciones Socio Familiares

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { SituacionSocioFamiliarService } from '@/services/SituacionSocioFamiliarService'
import type { SituacionSocioFamiliar } from '@/services/SituacionSocioFamiliarService'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'

export default function SituacionesSocioFamiliaresPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [situaciones, setSituaciones] = useState<SituacionSocioFamiliar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadSituaciones()
    }
  }, [user])

  const loadSituaciones = async () => {
    try {
      setLoading(true)
      setError('')

      const filtros: any = {}
      if (searchTerm) filtros.search = searchTerm

      const response = await SituacionSocioFamiliarService.getSituacionesSocioFamiliares(filtros)
      setSituaciones(response?.data || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar las situaciones socio familiares')
      setSituaciones([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta situación socio familiar?')) {
      return
    }

    try {
      await SituacionSocioFamiliarService.deleteSituacionSocioFamiliar(id)
      setSuccess('Situación socio familiar eliminada exitosamente')
      loadSituaciones()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la situación socio familiar')
    }
  }

  const handlePrintPDF = async (situacion: SituacionSocioFamiliar) => {
    try {
      const content = generatePDFContent(situacion)

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
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
            ${content}
            <div class="footer">
              <p>Documento confidencial de Trabajo Social. Su reproducción no autorizada está prohibida.</p>
            </div>
          </body>
          </html>
        `)
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

  const generatePDFContent = (situacion: SituacionSocioFamiliar): string => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'N/A'
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return `
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
    `
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              type="button"
              onClick={() => router.push('/registros')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a Registros
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Situación Socio Familiar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de situaciones socio familiares
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/registros/situacion-socio-familiar/nuevo')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            + Nueva Situación
          </button>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadSituaciones()}
                placeholder="Buscar en contenido..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadSituaciones}
                className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha de Creación
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {situaciones.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron situaciones socio familiares
                        </td>
                      </tr>
                    ) : (
                      situaciones.map((situacion) => (
                        <tr key={situacion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {situacion.id.slice(0, 8)}...
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(situacion.created_at).toLocaleDateString('es-ES')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/situacion-socio-familiar/${situacion.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/situacion-socio-familiar/${situacion.id}/editar`)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintPDF(situacion)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                            >
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(situacion.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total: {situaciones.length} situación{situaciones.length !== 1 ? 'es' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
