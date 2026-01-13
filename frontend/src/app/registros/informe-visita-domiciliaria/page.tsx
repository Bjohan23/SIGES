'use client'

// app/registros/informe-visita-domiciliaria/page.tsx
// Página de listado de Informes de Visita Domiciliaria

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { InformeVisitaDomiciliariaService } from '@/services/InformeVisitaDomiciliariaService'
import type { InformeVisitaDomiciliaria } from '@/services/InformeVisitaDomiciliariaService'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'

export default function InformesVisitaDomiciliariaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [informes, setInformes] = useState<InformeVisitaDomiciliaria[]>([])
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
      loadInformes()
    }
  }, [user])

  const loadInformes = async () => {
    try {
      setLoading(true)
      setError('')

      const filtros: any = {}
      if (searchTerm) filtros.search = searchTerm

      const response = await InformeVisitaDomiciliariaService.getInformesVisitasDomiciliarias(filtros)
      setInformes(response?.data || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar los informes de visita domiciliaria')
      setInformes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este informe de visita domiciliaria?')) {
      return
    }

    try {
      await InformeVisitaDomiciliariaService.deleteInformeVisitaDomiciliaria(id)
      setSuccess('Informe de visita domiciliaria eliminado exitosamente')
      loadInformes()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el informe de visita domiciliaria')
    }
  }

  const handlePrintPDF = async (informe: InformeVisitaDomiciliaria) => {
    try {
      const content = generatePDFContent(informe)

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Informe de Visita Domiciliaria - ${informe.nombres_apellidos || 'N/A'}</title>
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

  const generatePDFContent = (informe: InformeVisitaDomiciliaria): string => {
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
        <h1>INFORME DE VISITA DOMICILIARIA</h1>
        <p>Fecha de emisión: ${formatDate(informe.created_at)}</p>
      </div>

      <div class="section">
        <h3>I. DATOS GENERALES</h3>
        <div class="data-grid">
          <div class="field">
            <span class="field-label">Nombres:</span>
            <span class="field-value">${informe.nombres_apellidos || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Dirección:</span>
            <span class="field-value">${informe.direccion || 'N/A'}</span>
          </div>
          <div class="field full-width">
            <span class="field-label">Motivo:</span>
            <span class="field-value">${informe.motivo || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>II. OBJETIVOS DE LA VISITA DOMICILIARIA</h3>
        <div class="relato-box">
          <div class="relato-content">${informe.objetivos || 'Sin información'}</div>
        </div>
      </div>

      <div class="section">
        <h3>III. NARRACIÓN DE LA VISITA DOMICILIARIA</h3>
        <div class="relato-box">
          <div class="relato-content">${informe.narracion || 'Sin información'}</div>
        </div>
      </div>

      <div class="section">
        <h3>IV. CONCLUSIONES</h3>
        <div class="relato-box">
          <div class="relato-content">${informe.conclusiones || 'Sin información'}</div>
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
        {/* Header */}
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
              Informes de Visita Domiciliaria
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de informes de visita domiciliaria
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/registros/informe-visita-domiciliaria/nuevo')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            + Nuevo Informe
          </button>
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
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          </div>
        )}

        {/* Filtros */}
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
                onKeyDown={(e) => e.key === 'Enter' && loadInformes()}
                placeholder="Nombre, dirección..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadInformes}
                className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <>
            {/* Tabla */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nombres
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Dirección
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Motivo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {informes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron informes de visita domiciliaria
                        </td>
                      </tr>
                    ) : (
                      informes.map((informe) => (
                        <tr key={informe.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {informe.nombres_apellidos || 'Sin nombre'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {informe.direccion || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {informe.motivo || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/informe-visita-domiciliaria/${informe.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/informe-visita-domiciliaria/${informe.id}/editar`)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintPDF(informe)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                            >
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(informe.id)}
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

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total: {informes.length} informe{informes.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
